// HEVC/H.265 video playback for the video player.
//
// Most browsers cannot decode HEVC natively (Safari and a few hardware-backed
// Chrome builds are the exceptions). When a video element fails to play a file,
// we transcode it to H.264 in the browser via `@hevcjs/core` (libde265 compiled
// to WASM) and feed the result to the same `<video>` element through Media
// Source Extensions.
//
// Pipeline:
//   progressive HEVC mp4/mov
//     → mp4box.js fragments each track into fMP4 (init + media segments)
//     → MediaSource with two SourceBuffers:
//         • video: each HEVC segment is transcoded to H.264 in the hevc.js
//           transcode worker (WASM decode + WebCodecs encode) and appended.
//         • audio: AAC segments appended untouched (passthrough).
//     → <video> plays the muxed result with working duration/seeking + audio.
//
// We talk to the transcode worker directly rather than using
// `installMSEIntercept()` / `TranscodeWorkerClient`, for two reasons:
//   1. The decoder buffers frames in its DPB for B-frame reordering and only
//      emits them on `flush()` at end of stream. The intercept never flushes,
//      so short clips (whose frames never get "bumped" out by later segments)
//      silently produce no video. The worker exposes a `flush` message; we use
//      it. (`TranscodeWorkerClient` doesn't surface flush.)
//   2. The worker loads the WASM glue via `importScripts`, which works under
//      Vite's dev server — a main-thread `import()` of the served glue does not
//      (Vite can't `import()` a file from `public/`).
//
// The decoder/worker/wasm assets are served from `/hevc/` (see the
// `copy-hevc-worker` package script, run before storybook/build — the same
// pattern used for the pdf.js worker). Everything in this module is loaded
// lazily: the component only imports it once a video actually fails to play
// natively, so the ~700 KB of codec assets never touch the main bundle.

import {
  createFile,
  MP4BoxBuffer,
  type ISOFile,
  type Movie,
  type Track,
} from "mp4box";
import { H264Encoder } from "@hevcjs/core";

// Served asset locations. Copied from `@hevcjs/core/dist` into `public/hevc/`
// by the `copy-hevc-worker` script (its package `exports` map doesn't expose
// these sub-paths, so we cannot import them through the bundler directly).
const HEVC_ASSET_BASE = "/hevc";
const WORKER_URL = `${HEVC_ASSET_BASE}/transcode-worker.js`;
const WASM_GLUE_URL = `${HEVC_ASSET_BASE}/hevc-decode.js`;
const WASM_BINARY_URL = `${HEVC_ASSET_BASE}/hevc-decode.wasm`;

// Number of samples per fMP4 fragment. Smaller = faster first frame but more
// per-segment overhead; ~half a second of video at common frame rates.
const SAMPLES_PER_FRAGMENT = 30;

const HEVC_CODEC_RE = /^(hev1|hvc1)/i;

const abortError = () =>
  Object.assign(new Error("HEVC playback aborted"), { name: "AbortError" });

export interface HevcPlaybackController {
  /** Tear down MSE, release the worker/intercept and detach from the video. */
  destroy: () => void;
  /**
   * Whether the source is HDR (HLG/PQ or BT.2020). The transcoder outputs SDR
   * BT.709 without tone-mapping, so HDR sources look washed out — the player
   * applies an approximate colour correction when this is set.
   */
  isHdr: boolean;
}

interface FragmentedTrack {
  codec: string;
  /** MSE source-buffer mime, e.g. `video/mp4; codecs="hvc1.1.6.L93.B0"`. */
  mime: string;
  initSegment: Uint8Array;
  segments: Uint8Array[];
  /** Source `tkhd` display matrix (9 fixed-point ints) — carries rotation. */
  matrix?: number[];
  /** Track duration in seconds (from the source container). */
  durationSeconds?: number;
  /** Whether the source video is HDR (HLG/PQ transfer or BT.2020 primaries). */
  isHdr?: boolean;
}

const fourcc = (b: Uint8Array, i: number): string =>
  String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3]);

/** Find a direct child box of the given type within [start, end). */
const findBox = (
  b: Uint8Array,
  dv: DataView,
  type: string,
  start: number,
  end: number
): { start: number; size: number } | null => {
  let i = start;
  while (i + 8 <= end) {
    const size = dv.getUint32(i);
    if (fourcc(b, i + 4) === type) return { start: i, size };
    if (size < 8) break;
    i += size;
  }
  return null;
};

/**
 * iPhone/QuickTime `.mov` audio stores the AAC `esds` inside a QuickTime `wave`
 * atom nested in the `mp4a` sample entry. Chrome's MSE parser (ISO-BMFF) doesn't
 * look inside `wave`, so it reports "audio object type 0x0" and the append
 * fails. This rewrites the init segment to place the `esds` directly in `mp4a`
 * (ISO layout), dropping the `wave` wrapper, and returns the corrected codec
 * string. Returns null if the layout isn't recognised (caller keeps the
 * original / falls back to video-only).
 */
const liftQuickTimeAudioEsds = (
  init: Uint8Array
): { init: Uint8Array; codec: string } | null => {
  const dv = new DataView(init.buffer, init.byteOffset, init.byteLength);
  const len = init.length;

  // Walk moov > trak > mdia > minf > stbl > stsd > mp4a.
  const moov = findBox(init, dv, "moov", 0, len);
  if (!moov) return null;
  const trak = findBox(
    init,
    dv,
    "trak",
    moov.start + 8,
    moov.start + moov.size
  );
  if (!trak) return null;
  const mdia = findBox(
    init,
    dv,
    "mdia",
    trak.start + 8,
    trak.start + trak.size
  );
  if (!mdia) return null;
  const minf = findBox(
    init,
    dv,
    "minf",
    mdia.start + 8,
    mdia.start + mdia.size
  );
  if (!minf) return null;
  const stbl = findBox(
    init,
    dv,
    "stbl",
    minf.start + 8,
    minf.start + minf.size
  );
  if (!stbl) return null;
  const stsd = findBox(
    init,
    dv,
    "stsd",
    stbl.start + 8,
    stbl.start + stbl.size
  );
  if (!stsd) return null;
  // stsd is a FullBox: skip version/flags(4) + entry_count(4).
  const mp4a = findBox(
    init,
    dv,
    "mp4a",
    stsd.start + 16,
    stsd.start + stsd.size
  );
  if (!mp4a) return null;

  // `mp4a` is an AudioSampleEntry: its child boxes start after the fixed sound
  // fields (28 bytes for v0; QuickTime v1 adds 16, v2 adds 36). The version is
  // the uint16 right after the 8-byte SampleEntry preamble.
  const soundVersion = dv.getUint16(mp4a.start + 16);
  const soundFields = soundVersion === 1 ? 44 : soundVersion === 2 ? 64 : 28;
  const childStart = mp4a.start + 8 + soundFields;

  const wave = findBox(init, dv, "wave", childStart, mp4a.start + mp4a.size);
  if (!wave) return null; // already ISO layout — nothing to do.
  const esds = findBox(
    init,
    dv,
    "esds",
    wave.start + 8,
    wave.start + wave.size
  );
  if (!esds) return null;

  // Derive the codec string from the AudioSpecificConfig (first 5 bits =
  // audio object type) inside the esds DecoderSpecificInfo (tag 0x05).
  let codec = "mp4a.40.2";
  for (let i = esds.start + 8; i < esds.start + esds.size - 2; i++) {
    if (init[i] === 0x05) {
      // tag 0x05, then a (possibly multi-byte) length, then the ASC bytes.
      let j = i + 1;
      while (j < esds.start + esds.size && (init[j] & 0x80) !== 0) j++;
      const asc0 = init[j + 1];
      const objectType = asc0 >> 3;
      if (objectType > 0) codec = `mp4a.40.${objectType}`;
      break;
    }
  }

  // Rebuild mp4a: [header][audio fields up to wave][esds][boxes after wave].
  const fields = init.subarray(mp4a.start + 8, wave.start);
  const esdsBytes = init.subarray(esds.start, esds.start + esds.size);
  const after = init.subarray(wave.start + wave.size, mp4a.start + mp4a.size);
  const newMp4aSize = 8 + fields.length + esdsBytes.length + after.length;
  const delta = newMp4aSize - mp4a.size;

  const out = new Uint8Array(len + delta);
  const outDv = new DataView(out.buffer);
  out.set(init.subarray(0, mp4a.start), 0);
  outDv.setUint32(mp4a.start, newMp4aSize);
  out.set([0x6d, 0x70, 0x34, 0x61], mp4a.start + 4); // 'mp4a'
  let p = mp4a.start + 8;
  out.set(fields, p);
  p += fields.length;
  out.set(esdsBytes, p);
  p += esdsBytes.length;
  out.set(after, p);
  p += after.length;
  out.set(init.subarray(mp4a.start + mp4a.size), p);

  // Shrink every ancestor container box by the same delta.
  for (const anc of [moov, trak, mdia, minf, stbl, stsd]) {
    outDv.setUint32(anc.start, anc.size + delta);
  }

  return { init: out, codec };
};

/**
 * Detect an HDR / wide-gamut source from the `colr` box in an init segment:
 * PQ (transfer 16) or HLG (transfer 18) transfer, or BT.2020 primaries (9).
 */
const detectHdrFromInit = (init: Uint8Array): boolean => {
  const dv = new DataView(init.buffer, init.byteOffset, init.byteLength);
  for (let i = 0; i + 18 <= init.length; i++) {
    if (fourcc(init, i + 4) === "colr") {
      const primaries = dv.getUint16(i + 12);
      const transfer = dv.getUint16(i + 14);
      return transfer === 16 || transfer === 18 || primaries === 9;
    }
  }
  return false;
};

const IDENTITY_MATRIX = [65536, 0, 0, 0, 65536, 0, 0, 0, 1073741824];

const isIdentityMatrix = (m: number[]): boolean =>
  m.length === 9 && m.every((v, i) => v === IDENTITY_MATRIX[i]);

/**
 * Overwrite the `tkhd` display matrix of an fMP4 init segment in place.
 *
 * The transcoder emits an identity matrix, so a rotated source (e.g. an iPhone
 * portrait capture, whose frames are stored landscape + a 90° matrix) would
 * play sideways/letterboxed. Copying the source matrix makes the browser apply
 * the same rotation it would for native playback — so transcoded output renders
 * identically.
 */
const applyDisplayMatrix = (init: Uint8Array, matrix: number[]): void => {
  for (let i = 0; i + 8 <= init.length; i++) {
    // 'tkhd'
    if (
      init[i + 4] === 0x74 &&
      init[i + 5] === 0x6b &&
      init[i + 6] === 0x68 &&
      init[i + 7] === 0x64
    ) {
      const version = init[i + 8];
      // matrix offset within the box: header(8) + fullbox(4) + fields, where
      // creation/modification/duration are 4 bytes each (v0) or 8 each (v1).
      const matrixOffset = i + 8 + (version === 1 ? 52 : 40);
      if (matrixOffset + 36 > init.length) return;
      const dv = new DataView(init.buffer, init.byteOffset, init.byteLength);
      for (let k = 0; k < 9; k++) {
        dv.setInt32(matrixOffset + k * 4, matrix[k], false);
      }
      return;
    }
  }
};

/**
 * Whether the browser can decode HEVC natively (Safari, some Chrome builds).
 * When true, a video that still fails to play is genuinely broken and
 * transcoding won't help, so we can skip straight to the download fallback.
 */
export const hasNativeHevcSupport = (): boolean => {
  if (typeof MediaSource === "undefined") {
    return (
      typeof document !== "undefined" &&
      document
        .createElement("video")
        .canPlayType('video/mp4; codecs="hvc1.1.6.L93.B0"') !== ""
    );
  }
  return (
    MediaSource.isTypeSupported('video/mp4; codecs="hvc1.1.6.L93.B0"') ||
    MediaSource.isTypeSupported('video/mp4; codecs="hev1.1.6.L93.B0"')
  );
};

/** Whether in-browser HEVC → H.264 transcoding is possible in this browser. */
export const canTranscodeHevc = async (): Promise<boolean> => {
  if (typeof MediaSource === "undefined") return false;
  try {
    return H264Encoder.isSupported() && (await H264Encoder.checkSupport());
  } catch {
    return false;
  }
};

/**
 * Demux one track (the first video or audio track) of a progressive mp4/mov
 * into fragmented-mp4 segments using mp4box.js. Returns `null` when the file
 * has no such track (e.g. a video without an audio track).
 *
 * Each track is fragmented in its own mp4box instance so we get a single-track
 * init segment per track — `initializeSegmentation()` otherwise emits one moov
 * covering every fragmented track, which can't initialise separate
 * per-track SourceBuffers.
 */
const fragmentTrack = (
  data: ArrayBuffer,
  kind: "video" | "audio"
): Promise<FragmentedTrack | null> =>
  new Promise((resolve, reject) => {
    const mp4: ISOFile = createFile();
    const segments: Uint8Array[] = [];

    mp4.onError = (_module: string, message: string) => {
      reject(new Error(`mp4box: ${message}`));
    };

    mp4.onSegment = (
      _id: number,
      _user: unknown,
      buffer: ArrayBuffer
    ): void => {
      segments.push(new Uint8Array(buffer));
    };

    mp4.onReady = (info: Movie): void => {
      const track: Track | undefined =
        kind === "video" ? info.videoTracks[0] : info.audioTracks[0];
      if (!track) {
        resolve(null);
        return;
      }

      try {
        mp4.setSegmentOptions(track.id, null, {
          nbSamples: SAMPLES_PER_FRAGMENT,
        });
        const init = mp4.initializeSegmentation();
        let initSegment = new Uint8Array(init.buffer);
        let codecOverride: string | undefined;

        // QuickTime (.mov) audio nests the AAC esds in a `wave` atom that MSE
        // can't read — rewrite it to a clean ISO layout so audio plays.
        if (kind === "audio") {
          const fixed = liftQuickTimeAudioEsds(initSegment);
          if (fixed) {
            initSegment = fixed.init;
            codecOverride = fixed.codec;
          }
        }

        // Emit full segments from the already-buffered samples, then flush the
        // trailing partial segment.
        mp4.start();
        mp4.flush();

        // Note: some containers (notably iPhone .mov, whose QuickTime metadata
        // atoms trip up mp4box) yield a bare `mp4a` codec with no object type —
        // and a correspondingly broken esds. We deliberately keep the raw codec
        // string: `MediaSource.isTypeSupported` then rejects it, so the caller
        // skips audio and plays video-only rather than poisoning the stream.
        // Capture the track display matrix (rotation) for video, so we can
        // carry it onto the transcoded init segment.
        const matrix =
          kind === "video" && track.matrix
            ? Array.from({ length: 9 }, (_, i) => Number(track.matrix[i]))
            : undefined;
        const durationSeconds =
          track.timescale && track.duration
            ? track.duration / track.timescale
            : undefined;

        const codec = codecOverride ?? track.codec;
        resolve({
          codec,
          mime: `${kind}/mp4; codecs="${codec}"`,
          initSegment,
          segments,
          matrix,
          durationSeconds,
          isHdr: kind === "video" ? detectHdrFromInit(initSegment) : undefined,
        });
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };

    const buffer = MP4BoxBuffer.fromArrayBuffer(data, 0);
    mp4.appendBuffer(buffer, true);
  });

/** Append one chunk to a SourceBuffer, resolving after `updateend`. */
const appendChunk = (sb: SourceBuffer, chunk: Uint8Array): Promise<void> =>
  new Promise((resolve, reject) => {
    const cleanup = () => {
      sb.removeEventListener("updateend", onDone);
      sb.removeEventListener("error", onError);
    };
    const onDone = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("SourceBuffer append failed"));
    };
    sb.addEventListener("updateend", onDone);
    sb.addEventListener("error", onError);
    sb.appendBuffer(chunk);
  });

const appendAll = async (
  sb: SourceBuffer,
  chunks: Uint8Array[],
  signal: AbortSignal
): Promise<void> => {
  for (const chunk of chunks) {
    if (signal.aborted) throw abortError();
    await appendChunk(sb, chunk);
  }
};

/** Remove buffered coded frames past `untilSeconds` (resolves after updateend). */
const trimBufferAfter = (
  sb: SourceBuffer,
  untilSeconds: number
): Promise<void> => {
  const { buffered } = sb;
  if (
    buffered.length === 0 ||
    buffered.end(buffered.length - 1) <= untilSeconds + 0.5
  ) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const done = () => {
      sb.removeEventListener("updateend", done);
      sb.removeEventListener("error", done);
      resolve();
    };
    sb.addEventListener("updateend", done);
    sb.addEventListener("error", done);
    sb.remove(untilSeconds, Infinity);
  });
};

interface TranscodeWorker {
  /** Parse the HEVC init segment and return a matching H.264 init segment. */
  prepareInit: (initSegment: Uint8Array) => Promise<{
    initSegment: Uint8Array;
    codec: string;
  }>;
  /** Transcode one HEVC media segment → H.264 fMP4 (null if no frames yet). */
  transcode: (segment: Uint8Array) => Promise<Uint8Array | null>;
  /** Flush the decoder/encoder reorder buffers → final H.264 segment, if any. */
  flush: () => Promise<Uint8Array | null>;
  destroy: () => void;
}

/**
 * Minimal promise wrapper around the hevc.js transcode worker. Requests are
 * strictly sequential (we await each before sending the next), so a single
 * pending slot is enough — no message-id correlation needed.
 */
const createTranscodeWorker = async (): Promise<TranscodeWorker> => {
  const worker = new Worker(WORKER_URL);
  let pending: {
    resolve: (msg: Record<string, unknown>) => void;
    reject: (err: Error) => void;
  } | null = null;

  worker.onmessage = (e: MessageEvent) => {
    const msg = e.data as Record<string, unknown>;
    const slot = pending;
    if (!slot) return;
    pending = null;
    if (msg.type === "error") {
      slot.reject(new Error(String(msg.message ?? "transcode worker error")));
    } else {
      slot.resolve(msg);
    }
  };
  worker.onerror = (e: ErrorEvent) => {
    const slot = pending;
    pending = null;
    slot?.reject(new Error(e.message || "transcode worker crashed"));
  };

  const request = (
    msg: Record<string, unknown>
  ): Promise<Record<string, unknown>> =>
    new Promise((resolve, reject) => {
      pending = { resolve, reject };
      worker.postMessage(msg);
    });

  await request({
    type: "init",
    config: { wasmUrl: WASM_GLUE_URL, wasmBinaryUrl: WASM_BINARY_URL },
  });

  return {
    prepareInit: async (initSegment) => {
      const res = await request({
        type: "prepareInit",
        id: 0,
        data: initSegment,
      });
      return {
        initSegment: new Uint8Array(res.initSegment as ArrayBuffer),
        codec: res.codec as string,
      };
    },
    transcode: async (segment) => {
      const res = await request({ type: "mediaSegment", id: 1, data: segment });
      return res.h264 ? new Uint8Array(res.h264 as ArrayBuffer) : null;
    },
    flush: async () => {
      const res = await request({ type: "flush" });
      return res.h264 ? new Uint8Array(res.h264 as ArrayBuffer) : null;
    },
    destroy: () => {
      try {
        worker.postMessage({ type: "destroy" });
      } catch {
        // Worker already gone.
      }
      worker.terminate();
    },
  };
};

/**
 * Transcode a (likely-HEVC) progressive video and play it on `video` via MSE.
 *
 * Resolves once the `<video>` has a decoded frame (it can start playing) or,
 * for very short clips whose frames only emerge at flush, once the whole stream
 * has been transcoded. Rejects if the file isn't HEVC, the browser can't
 * transcode, or no video frames could be produced — callers should fall back to
 * a download prompt. Aborting `signal` cancels in-flight work and tears down.
 */
export const playHevcViaTranscoding = async (
  video: HTMLVideoElement,
  src: string,
  signal: AbortSignal
): Promise<HevcPlaybackController> => {
  const response = await fetch(src, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch video (${response.status})`);
  }
  const data = await response.arrayBuffer();
  if (signal.aborted) throw abortError();

  const videoTrack = await fragmentTrack(data, "video");
  if (!videoTrack) {
    throw new Error("No video track found");
  }
  if (!HEVC_CODEC_RE.test(videoTrack.codec)) {
    // Not HEVC — transcoding can't help (the native failure was something else).
    throw new Error(`Unsupported video codec: ${videoTrack.codec}`);
  }
  if (!(await canTranscodeHevc())) {
    throw new Error("HEVC transcoding is not supported in this browser");
  }

  const audioTrack = await fragmentTrack(data, "audio");
  if (signal.aborted) throw abortError();

  // Set up the HEVC → H.264 transcode worker. `prepareInit` parses the HEVC
  // init and produces a matching H.264 init segment up front (via a warmup
  // frame) so we can create the SourceBuffer before the first media segment.
  const transcoder = await createTranscodeWorker();
  let h264Init: { initSegment: Uint8Array; codec: string };
  try {
    h264Init = await transcoder.prepareInit(videoTrack.initSegment);
  } catch (err) {
    transcoder.destroy();
    throw err;
  }
  if (signal.aborted) {
    transcoder.destroy();
    throw abortError();
  }

  // Carry the source rotation (e.g. iPhone portrait captures) onto the
  // transcoded init so playback matches native instead of showing sideways /
  // letterboxed.
  if (videoTrack.matrix && !isIdentityMatrix(videoTrack.matrix)) {
    applyDisplayMatrix(h264Init.initSegment, videoTrack.matrix);
  }

  const mediaSource = new MediaSource();
  const objectUrl = URL.createObjectURL(mediaSource);

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    try {
      if (mediaSource.readyState === "open") mediaSource.endOfStream();
    } catch {
      // MediaSource already torn down.
    }
    try {
      transcoder.destroy();
    } catch {
      // Already destroyed.
    }
    URL.revokeObjectURL(objectUrl);
    video.removeAttribute("src");
    try {
      video.load();
    } catch {
      // Ignore — element may be detached.
    }
  };

  if (signal.aborted) {
    destroy();
    throw abortError();
  }
  signal.addEventListener("abort", destroy, { once: true });

  video.src = objectUrl;

  try {
    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const settle = (run: () => void) => {
        if (!settled) {
          settled = true;
          run();
        }
      };

      // Resolve as soon as the element has a decoded frame so the spinner can
      // hide while the rest keeps transcoding in the background.
      video.addEventListener("loadeddata", () => settle(resolve), {
        once: true,
      });

      const onSourceOpen = async () => {
        try {
          URL.revokeObjectURL(objectUrl);

          // All SourceBuffers must be added up front: MSE rejects
          // addSourceBuffer once any buffer has received data.
          const videoSb = mediaSource.addSourceBuffer(
            `video/mp4; codecs="${h264Init.codec}"`
          );

          // Audio passthrough — strictly best-effort. We only attempt it when
          // the browser reports the exact codec as supported; if anything goes
          // wrong we play video-only rather than failing (a failed append would
          // otherwise poison the whole MediaSource, killing the video too).
          let audioSb: SourceBuffer | null = null;
          if (audioTrack && MediaSource.isTypeSupported(audioTrack.mime)) {
            try {
              audioSb = mediaSource.addSourceBuffer(audioTrack.mime);
            } catch (err) {
              console.warn("HEVC: audio unavailable, playing video-only", err);
              audioSb = null;
            }
          } else if (audioTrack) {
            console.warn(
              `HEVC: audio codec "${audioTrack.codec}" unsupported, playing video-only`
            );
          }

          // Append init segments (both buffers now exist).
          await appendChunk(videoSb, h264Init.initSegment);
          if (audioSb && audioTrack) {
            try {
              await appendChunk(audioSb, audioTrack.initSegment);
            } catch (err) {
              console.warn("HEVC: audio init failed, playing video-only", err);
              audioSb = null;
            }
          }

          // Append the (untouched) audio first — it's a fast passthrough (no
          // transcode), so it's fully buffered before playback starts.
          // Best-effort: drop audio on any error and continue video-only.
          if (audioSb && audioTrack) {
            try {
              await appendAll(audioSb, audioTrack.segments, signal);
            } catch (err) {
              if (!signal.aborted) {
                console.warn("HEVC: audio playback failed, video-only", err);
              }
            }
          }

          // Transcode each HEVC segment → H.264 and append it, then flush the
          // decoder's reorder buffer at the end. The flush is what makes short
          // clips work: their frames stay in the DPB until end of stream.
          let producedVideo = false;
          for (const segment of videoTrack.segments) {
            if (signal.aborted) throw abortError();
            const h264 = await transcoder.transcode(segment);
            if (h264) {
              await appendChunk(videoSb, h264);
              producedVideo = true;
            }
          }
          const tail = await transcoder.flush();
          if (tail && !signal.aborted) {
            await appendChunk(videoSb, tail);
            producedVideo = true;
          }

          // Pin the media duration to the source's real duration. The
          // transcoder can emit a stray sample with a corrupt presentation time
          // (e.g. a B-frame negative composition offset misread as ~2^32),
          // which would otherwise blow the seekbar out to millions of seconds.
          // Trim any such out-of-range frames first, then shrink the duration
          // (MSE rejects shrinking below buffered content).
          const realDuration = videoTrack.durationSeconds;
          if (
            !signal.aborted &&
            mediaSource.readyState === "open" &&
            realDuration &&
            Number.isFinite(realDuration)
          ) {
            try {
              await trimBufferAfter(videoSb, realDuration);
              if (audioSb) await trimBufferAfter(audioSb, realDuration);
              if (mediaSource.readyState === "open") {
                mediaSource.duration = realDuration;
              }
            } catch {
              // Best-effort; the seekbar falls back to the buffered range.
            }
          }

          if (!signal.aborted && mediaSource.readyState === "open") {
            mediaSource.endOfStream();
          }

          if (!producedVideo) {
            settle(() =>
              reject(new Error("Transcoding produced no video frames"))
            );
          } else {
            // In case `loadeddata` never fired (e.g. data already buffered).
            settle(resolve);
          }
        } catch (err) {
          settle(() =>
            reject(err instanceof Error ? err : new Error(String(err)))
          );
        }
      };
      mediaSource.addEventListener("sourceopen", onSourceOpen, { once: true });
    });
  } catch (err) {
    signal.removeEventListener("abort", destroy);
    destroy();
    throw err;
  }

  return { destroy, isHdr: videoTrack.isHdr === true };
};
