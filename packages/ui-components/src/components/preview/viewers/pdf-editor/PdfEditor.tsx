import { useEffect, useRef, useState } from "react";  
import "../pdf-preview/pdfPolyfills";  
import {  
  getDocument,  
  GlobalWorkerOptions,  
  AnnotationEditorType,
  AnnotationEditorParamsType,
} from "pdfjs-dist";
import {  
  PDFViewer,  
  EventBus,  
  GenericL10n,  
} from "pdfjs-dist/web/pdf_viewer.mjs";  
import {  
  DEFAULT_PDF_WORKER_SRC,  
  DEFAULT_PDF_ASSETS_URL,  
} from "../pdf-preview/pdfConsts";  
import "pdfjs-dist/web/pdf_viewer.css";  
  
interface PdfEditorProps {  
  src: string;  
  pdfWorkerSrc?: string;  
  pdfAssetsUrl?: string;  
}  
  
// Union of all AnnotationEditorType values: -1 | 0 | 3 | 9 | 13 | ...  
type EditorMode =  
  (typeof AnnotationEditorType)[keyof typeof AnnotationEditorType];  
  
export function PdfEditor({  
  src,  
  pdfWorkerSrc = DEFAULT_PDF_WORKER_SRC,  
  pdfAssetsUrl = DEFAULT_PDF_ASSETS_URL,  
}: PdfEditorProps) {  
  const containerRef = useRef<HTMLDivElement>(null);  
  const viewerRef = useRef<PDFViewer | null>(null);
  const eventBusRef = useRef<EventBus | null>(null);
  
  // Initial state: NONE (read-only, no editing tool active)  
  const [editorMode, setEditorMode] = useState<EditorMode>(  
    AnnotationEditorType.NONE  
  );  
  // Buttons stay disabled until the AnnotationEditorUIManager exists  
  const [editorReady, setEditorReady] = useState(false);  
  
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
      annotationEditorMode: AnnotationEditorType.NONE, // explicit  
      // @ts-expect-error pdf.js reads abortSignal, but PDFViewerOptions omits it  
      abortSignal: abortController.signal,  
    });  
    viewerRef.current = pdfViewer;
    eventBusRef.current = eventBus;
  
    eventBus.on("pagesinit", () => {  
      pdfViewer.currentScaleValue = "page-width";  
    });  
  
    // The UIManager is created inside setDocument → enable the buttons  
    eventBus.on("annotationeditoruimanager", () => {  
      setEditorReady(true);  
    });  
  
    // Sync React state with the viewer's actual mode (async on pdf.js side)  
    eventBus.on("annotationeditormodechanged", (evt: { mode: EditorMode }) => {  
      setEditorMode(evt.mode);  
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
        if (!cancelled)  
          console.error("PDF loading error:", error);  
      }  
    })();  
  
    return () => {  
      cancelled = true;  
      viewerRef.current = null;
      eventBusRef.current = null;
      setEditorReady(false);  
      // @ts-expect-error pdf.js accepts null to reset the viewer  
      pdfViewer.setDocument(null); // reset view + destroy UIManager  
      abortController.abort();     // disconnect ResizeObserver + watchScroll  
      loadingTask.destroy();       // abort network + terminate the worker  
    };  
  }, [src, pdfWorkerSrc, pdfAssetsUrl]);  
  
  /** Toggle a mode: clicking the active button again returns to NONE. */  
  const toggleMode = (mode: EditorMode) => {  
    const viewer = viewerRef.current;  
    if (!viewer || !editorReady) return;
    
    const next = editorMode === mode ? AnnotationEditorType.NONE : mode;  
    // The setter expects an object { mode }, not a raw number  
    viewer.annotationEditorMode = { mode: next };
  };

  /**
   * In STAMP mode pdf.js ignores clicks on the page: an image is added on
   * this request, which opens the file picker. Browsers only open a file
   * picker during a user gesture, so it must run in the click itself.
   */
  const addImage = () => {
    eventBusRef.current?.dispatch("switchannotationeditorparams", {
      source: viewerRef.current,
      type: AnnotationEditorParamsType.CREATE,
    });
  };
  
  const buttons: { label: string; mode: EditorMode }[] = [  
    { label: "Text", mode: AnnotationEditorType.FREETEXT },  
    { label: "Image (stamp)", mode: AnnotationEditorType.STAMP },  
  ];  
  
  return (  
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>  
      <div style={{ display: "flex", gap: 8, padding: 8 }}>  
        {buttons.map(({ label, mode }) => (  
          <button  
            key={mode}  
            disabled={!editorReady}  
            aria-pressed={editorMode === mode}  
            onClick={() => toggleMode(mode)}  
            style={{  
              fontWeight: editorMode === mode ? "bold" : "normal",  
              textDecoration: editorMode === mode ? "underline" : "none",  
            }}  
          >  
            {label}  
          </button>  
        ))}
        {editorMode === AnnotationEditorType.STAMP && (
          <button onClick={addImage}>Add image</button>
        )}
      </div>
  
      {/* pdf.js requires an absolutely positioned container: this relative
          wrapper takes the space left by the toolbar, the container fills it */}
      <div style={{ position: "relative", flex: 1 }}>
        <div
          ref={containerRef}
          style={{ position: "absolute", inset: 0, overflow: "auto" }}
        >
          <div className="pdfViewer" />
        </div>
      </div>
    </div>  
  );  
}