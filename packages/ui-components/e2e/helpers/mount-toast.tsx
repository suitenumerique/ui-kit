import { useEffect, useRef } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import { useToastProvider } from "../../src/components/toast/ToastProvider";
import { VariantType } from "../../src/utils/VariantUtils";
import type { ToastId } from "../../src/components/toast/types";

// Playwright CT cannot pass callbacks through the mount bridge, so the
// helper which runs in the browser — owns toast() / toastExtended() and
// records action clicks on window.__toastCalls.

declare global {
  interface Window {
    __toastCalls: string[];
  }
}

const ToastControls = () => {
  const { toast, toastExtended, dismissToast } = useToastProvider();
  const lastId = useRef<ToastId>(undefined);
  const stack = useRef(0);

  useEffect(() => {
    window.__toastCalls = [];
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          lastId.current = toast("Document moved", VariantType.INFO, {
            progress: 15,
            disableAnimate: true,
          });
        }}
      >
        Show toast
      </button>
      <button
        type="button"
        onClick={() => {
          lastId.current = toast("Uploading document", VariantType.INFO, {
            duration: 800,
          });
        }}
      >
        Show fading toast
      </button>
      <button
        type="button"
        onClick={() => {
          stack.current += 1;
          toast(`Document ${stack.current} moved`, VariantType.SUCCESS, {
            disableAnimate: true,
          });
        }}
      >
        Stack toast
      </button>
      <button
        type="button"
        onClick={() => {
          lastId.current = toast(
            "Document 1 moved to Document 2",
            VariantType.INFO,
            {
              progress: 15,
              disableAnimate: true,
              actions: [
                {
                  label: "See",
                  onClick: () => window.__toastCalls.push("see"),
                },
                {
                  label: "Cancel",
                  onClick: () => {
                    window.__toastCalls.push("cancel");
                    dismissToast(lastId.current);
                  },
                },
              ],
            },
          );
        }}
      >
        Show actions
      </button>
      <button
        type="button"
        onClick={() => {
          lastId.current = toastExtended({
            summary: "2 documents in transfer",
            progress: 15,
            items: [
              {
                id: "1",
                title: "Report",
                size: "2 MB",
                mimetype: "application/pdf",
                status: "completed",
              },
              {
                id: "2",
                title: "Picture",
                mimetype: "image/jpeg",
                status: "loading",
              },
            ],
            onClose: () => dismissToast(lastId.current),
            onInfoClick: () => window.__toastCalls.push("info"),
          });
        }}
      >
        Show extended
      </button>
      <button type="button" onClick={() => dismissToast(lastId.current)}>
        Dismiss
      </button>
    </>
  );
};

export const TestToast = () => (
  <CunninghamProvider currentLocale="en-US">
    <ToastControls />
  </CunninghamProvider>
);
