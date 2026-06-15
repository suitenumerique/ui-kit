import { Component, ReactNode, useEffect, useState } from "react";
import { init, IronCalc, Model } from "@ironcalc/workbook";
import "@ironcalc/workbook/style.css";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";

// wasm-bindgen's default init resolves `wasm_bg.wasm` relative to its own
// (pre-bundled) module URL, which bundlers don't emit — so we hand it the asset
// URL explicitly. `?url` lets the bundler fingerprint and serve the wasm.
import wasmUrl from "@ironcalc/wasm/wasm_bg.wasm?url";

/**
 * IronCalc's canvas renderer can throw while drawing some real-world files
 * (e.g. "Invalid index provided") even when the file parsed fine. Such throws
 * happen during render, so they must be caught by an error boundary rather than
 * the load-time try/catch — otherwise they crash the whole preview.
 */
class RenderBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("IronCalc failed to render spreadsheet", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface IronCalcViewerProps {
  /** URL of the xlsx/ods file to load. */
  src: string;
  /** Rendered if IronCalc can't parse the file (the de-facto compatibility gate). */
  errorFallback?: React.ReactNode;
}

// Initialise the wasm engine + i18n exactly once for the whole app.
let enginePromise: Promise<unknown> | null = null;
const ensureEngine = () => {
  if (!enginePromise) {
    enginePromise = init({ module_or_path: wasmUrl });
  }
  return enginePromise;
};

/**
 * Read-only spreadsheet preview rendered by IronCalc itself: the xlsx is parsed
 * in-browser by the IronCalc wasm engine ({@link Model.loadFromXlsx}) and drawn
 * by IronCalc's own canvas worksheet (with keyboard navigation and sheet tabs),
 * minus the editing toolbar — see the `readOnly` prop we added upstream.
 */
export const IronCalcViewer = ({ src, errorFallback }: IronCalcViewerProps) => {
  const { t } = useCustomTranslations();
  const [model, setModel] = useState<Model | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setModel(null);
    setFailed(false);

    (async () => {
      try {
        await ensureEngine();
        const response = await fetch(src, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch spreadsheet (${response.status})`);
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (controller.signal.aborted) return;
        const name = src.split("/").pop() || "Spreadsheet";
        const loaded = Model.loadFromXlsx(bytes, name, "en", "UTC", "en");
        // xlsx stores the sheet that was active when saved; for a preview we
        // always want to start on the first tab.
        try {
          loaded.setSelectedSheet(0);
        } catch {
          /* single-sheet or unsupported — ignore */
        }
        if (controller.signal.aborted) return;
        setModel(loaded);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("IronCalc failed to load spreadsheet", err);
        setFailed(true);
      }
    })();

    return () => controller.abort();
  }, [src]);

  if (failed) {
    return <>{errorFallback}</>;
  }

  if (!model) {
    return (
      <div className="spreadsheet-preview__status" data-preview-backdrop="true">
        <div className="spreadsheet-preview__spinner" />
        <span>{t("components.filePreview.spreadsheet.loading")}</span>
      </div>
    );
  }

  return (
    <div className="spreadsheet-preview__ironcalc">
      <RenderBoundary fallback={errorFallback}>
        <IronCalc model={model} canEdit={false} />
      </RenderBoundary>
    </div>
  );
};

export default IronCalcViewer;
