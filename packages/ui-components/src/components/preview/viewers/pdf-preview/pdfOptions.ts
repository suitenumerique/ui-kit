import { DEFAULT_PDF_ASSETS_URL } from "./pdfConsts";

/**
 * Build the `options` passed to pdfjs-dist for every document.
 *
 * pdfjs-dist lazily fetches extra assets next to the worker: the wasm
 * decoders (`wasm/` — OpenJPEG for JPEG 2000 images, qcms for ICC profiles),
 * fallback fonts (`standard_fonts/`) and CJK encodings (`cmaps/`). When these
 * URLs are unreachable pdfjs silently skips the affected content — e.g. the
 * JPX layers of scanned PDFs are never drawn — so the base URL must point at
 * a copy of the corresponding `pdfjs-dist` folders.
 */
export function getPdfOptions(assetsUrl: string = DEFAULT_PDF_ASSETS_URL) {
  const base = assetsUrl.endsWith("/") ? assetsUrl : `${assetsUrl}/`;
  return {
    cMapUrl: `${base}cmaps/`,
    standardFontDataUrl: `${base}standard_fonts/`,
    wasmUrl: `${base}wasm/`,
    isEvalSupported: false,
  };
}
