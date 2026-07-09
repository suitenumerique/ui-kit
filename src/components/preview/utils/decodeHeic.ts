// HEIC/HEIF decoding for the image viewer.
//
// HEIC is an HEVC-encoded image in a HEIF container: there is no pure-JS
// decoder that is both correct and fast, so we lean on `heic-to` (libheif
// compiled to WASM). The codec payload is ~2.9 MB, so it is loaded lazily —
// only the first time a HEIC file is actually opened — via dynamic import.
//
// We use the `/csp` entry. Like every heic-to entry it decodes in a
// self-contained Web Worker (spun up from a blob URL), so the main thread
// stays responsive. Unlike the default/`/next` entries it is built without
// `eval`/`new Function`, so it runs under strict Content Security Policies
// that forbid `unsafe-eval` — important for a library embedded in locked-down
// host apps. Note the blob worker still requires `worker-src blob:` (or a
// permissive `default-src`) in the host CSP.

// Cache the dynamic import so the WASM module is fetched and instantiated once
// per session, not once per HEIC file.
let heicToModule: Promise<typeof import("heic-to/csp")> | null = null;

const loadHeicTo = () => {
  if (!heicToModule) {
    heicToModule = import("heic-to/csp");
  }
  return heicToModule;
};

/**
 * Some platforms (Safari / iOS) decode HEIC natively. When `createImageBitmap`
 * succeeds on the raw blob, the browser can also render it in an `<img>`, so we
 * return an object URL for the original blob and skip the WASM download
 * entirely. Returns `null` when the platform cannot decode HEIC natively.
 */
const tryNativeDecode = async (blob: Blob): Promise<string | null> => {
  if (typeof createImageBitmap !== "function") {
    return null;
  }
  try {
    const bitmap = await createImageBitmap(blob);
    bitmap.close();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

/**
 * Fetches a HEIC image and returns an object URL pointing to a renderable
 * (JPEG, or the original blob on platforms with native support) version.
 *
 * The caller owns the returned URL and must `URL.revokeObjectURL` it when the
 * image is no longer displayed.
 */
export const decodeHeicToObjectUrl = async (
  src: string,
  signal?: AbortSignal,
): Promise<string> => {
  const response = await fetch(src, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch HEIC image (${response.status})`);
  }
  const blob = await response.blob();

  const nativeUrl = await tryNativeDecode(blob);
  if (nativeUrl) {
    return nativeUrl;
  }

  const { heicTo } = await loadHeicTo();
  const jpeg = await heicTo({ blob, type: "image/jpeg", quality: 0.85 });
  return URL.createObjectURL(jpeg);
};
