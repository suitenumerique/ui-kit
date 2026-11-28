import { useEffect, useRef } from "react";
import "../pdf-preview/pdfPolyfills";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { PDFViewer, EventBus, GenericL10n } from "pdfjs-dist/web/pdf_viewer.mjs";
import { DEFAULT_PDF_WORKER_SRC, DEFAULT_PDF_ASSETS_URL } from "../pdf-preview/pdfConsts";
import "pdfjs-dist/web/pdf_viewer.css";


interface PdfEditorProps{
  src: string;
  pdfWorkerSrc?: string;
  pdfAssetsUrl?: string;
}

export function PdfEditor({
    src,
    pdfWorkerSrc = DEFAULT_PDF_WORKER_SRC,
    pdfAssetsUrl = DEFAULT_PDF_ASSETS_URL,
  }: PdfEditorProps){
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {  
  const container = containerRef.current;  
  if (!container) return;  
  
  GlobalWorkerOptions.workerSrc = pdfWorkerSrc;  
  
  const abortController = new AbortController();  
  const eventBus = new EventBus();  
  const pdfViewer = new PDFViewer({  
    container,  
    eventBus,  
    l10n: new GenericL10n(navigator.language),
    // @ts-expect-error pdf.js reads abortSignal, but PDFViewerOptions omits it
    abortSignal: abortController.signal,   // cleanup scroll + ResizeObserver  
  });  
  
  eventBus.on("pagesinit", () => {  
    pdfViewer.currentScaleValue = "page-width";  
  });  
  
  const loadingTask = getDocument({ 
    url: src,
    cMapUrl: `${pdfAssetsUrl}cmaps/`,  
    cMapPacked: true,  
    iccUrl: `${pdfAssetsUrl}iccs/`,  
    standardFontDataUrl: `${pdfAssetsUrl}standard_fonts/`,  
    wasmUrl: `${pdfAssetsUrl}wasm/`,  
    enableXfa: true,
});  
  let cancelled = false;  
  
  (async () => {  
    try {  
      const pdfDocument = await loadingTask.promise;  
      if (!cancelled) {  
        pdfViewer.setDocument(pdfDocument);
      }  
    } catch (error) {  
      if (!cancelled) console.error("Erreur de chargement du PDF :", error);  
    }  
  })();  
  
  return () => {  
    cancelled = true;
    // @ts-expect-error pdf.js accepts null to reset the viewer, its types don't
    pdfViewer.setDocument(null);   // reset view + destroy UIManager  
    abortController.abort();       // déconnecte ResizeObserver + watchScroll  
    loadingTask.destroy();         // abort réseau + termine le worker  
  };  
}, [src, pdfWorkerSrc, pdfAssetsUrl]);
 

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "auto" }}>
      {/* <h2>{src}</h2> */}
      <div className="pdfViewer">
      </div>
    </div>
  );
}