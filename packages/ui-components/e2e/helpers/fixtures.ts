import type { FilePreviewType } from "../../src/components/preview/types";

const ROOT = "storybook/preview-files";

const file = (
  id: string,
  title: string,
  mimetype: string,
  extras: Partial<FilePreviewType> = {},
): FilePreviewType => ({
  id,
  title,
  mimetype,
  size: 0,
  url: `${ROOT}/${title}`,
  url_preview: `${ROOT}/${title}`,
  ...extras,
});

export const imageFile = file("img-monet", "monet_1.jpeg", "image/jpeg");

export const videoFile = file("vid-chantier", "chantier.mp4", "video/mp4");

export const audioFile = file(
  "aud-noise",
  "nuissance_sonores.mp3",
  "audio/mpeg",
);

export const pdfFile = file("pdf-pvcm", "pv_cm.pdf", "application/pdf");

export const pdfCmFile = file(
  "pdf-cm",
  "CR Conseil municipal vfvdef_maireok.pdf",
  "application/pdf",
);

export const pdfMixedFile = file(
  "pdf-mixed",
  "mixed_page_sizes.pdf",
  "application/pdf",
);

export const pdfLinksFile = file(
  "pdf-links",
  "pdf_with_links.pdf",
  "application/pdf",
);

export const pdfJsFile = file(
  "pdf-js",
  "pdf_with_js.pdf",
  "application/pdf",
);

export const pdfJsLinkFile = file(
  "pdf-jslink",
  "pdf_with_js_link.pdf",
  "application/pdf",
);

export const pdfCorruptedFile = file(
  "pdf-corrupted",
  "pdf_corrupted.pdf",
  "application/pdf",
);

export const heicFile = file("heic-img", "IMG_7665.heic", "image/heic");

export const unsupportedFile = file(
  "bin-unsupported",
  "test-unsupported.bin",
  "application/octet-stream",
);
