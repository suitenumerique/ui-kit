import type { FilePreviewType } from "../types";

const ROOT = "storybook/preview-files";

const file = (
  id: string,
  title: string,
  mimetype: string,
  extras: Partial<FilePreviewType> = {}
): FilePreviewType => ({
  id,
  title,
  mimetype,
  size: 0,
  url: `${ROOT}/${title}`,
  url_preview: `${ROOT}/${title}`,
  ...extras,
});

export const imageFiles: FilePreviewType[] = [
  file("img-monet", "monet_1.jpeg", "image/jpeg"),
  file("img-rembrandt", "Rembrandt_Winterlandschap_1646.jpg", "image/jpeg"),
  file(
    "img-aic",
    "art-institute-of-chicago-ce0DXHdjbhw-unsplash 1.png",
    "image/png"
  ),
];

export const videoFiles: FilePreviewType[] = [
  file("vid-chantier", "chantier.mp4", "video/mp4"),
];

// HEVC/H.265 video in a plain mp4 container (mimetype `video/mp4`, like a real
// upload — the codec isn't in the mimetype). Browsers without native HEVC
// support transcode it to H.264 in the browser; Safari plays it natively.
// Re-encoded from `chantier.mp4` with `ffmpeg -c:v libx265 -tag:v hvc1`.
export const hevcVideoFile: FilePreviewType = file(
  "vid-hevc",
  "chantier-hevc.mp4",
  "video/mp4"
);

// Real iPhone capture (QuickTime .mov): 10-bit Main 10 HEVC, HDR, portrait via
// a 90° display matrix, AAC audio nested in a QuickTime `wave` atom. Exercises
// the rotation, duration and audio-esds handling of the transcoder.
export const iphoneVideoFile: FilePreviewType = file(
  "vid-iphone",
  "iphone-hevc.mov",
  "video/quicktime"
);

export const audioFiles: FilePreviewType[] = [
  file("aud-noise", "nuissance_sonores.mp3", "audio/mpeg"),
];

export const pdfFiles: FilePreviewType[] = [
  file("pdf-cm", "CR Conseil municipal vfvdef_maireok.pdf", "application/pdf"),
  file("pdf-mixed", "mixed_page_sizes.pdf", "application/pdf"),
  file("large-pdf", "XFA-3_3.pdf", "application/pdf"),
];

export const heicFile: FilePreviewType = file(
  "heic-img",
  "IMG_7665.heic",
  "image/heic"
);

export const unsupportedFiles: FilePreviewType[] = [
  file("iso-folders", "Folders.iso", "application/octet-stream"),
  file("zip-archive", "Archive.7z", "application/x-7z-compressed"),
  file("pages-coucou", "coucou.pages", "application/octet-stream"),
];

export const suspiciousFile: FilePreviewType = {
  ...file("susp-archive", "Archive.7z", "application/x-7z-compressed"),
  isSuspicious: true,
};

export const wopiFile: FilePreviewType = {
  ...file(
    "wopi-tableau",
    "Tableau.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ),
  is_wopi_supported: true,
};

// All non-special fixtures, ordered so prev/next sweeps through every viewer.
export const allFiles: FilePreviewType[] = [
  ...imageFiles,
  ...videoFiles,
  hevcVideoFile,
  ...audioFiles,
  ...pdfFiles,
  heicFile,
  ...unsupportedFiles,
  suspiciousFile,
  wopiFile,
];
