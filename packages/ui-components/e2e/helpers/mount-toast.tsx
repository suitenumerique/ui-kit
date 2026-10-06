import { useEffect, useRef, useState } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import { useToastProvider } from "../../src/components/toast/ToastProvider";
import { Toast } from "../../src/components/toast";
import { VariantType } from "../../src/utils/VariantUtils";
import type { ToastId } from "../../src/components/toast/types";
declare global {
  interface Window {
    __toastCalls: string[];
  }
}

const ToastControls = () => {
  const { toast, updateToast, dismissToast } = useToastProvider();
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
        onClick={() =>
          lastId.current &&
          updateToast(lastId.current, {
            message: "Document uploaded",
            type: VariantType.SUCCESS,
            progress: 100,
          })
        }
      >
        Update toast
      </button>
      <button type="button" onClick={() => dismissToast(lastId.current)}>
        Dismiss
      </button>
    </>
  );
};

// A toast mounted directly, outside the provider: it runs its own timer and
// reports through window.__toastCalls once it has faded out.
const StandaloneToast = () => {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    window.__toastCalls = [];
  }, []);

  if (gone) {
    return <p>deleted</p>;
  }
  return (
    <Toast
      type={VariantType.SUCCESS}
      duration={200}
      onDelete={() => {
        window.__toastCalls.push("deleted");
        setGone(true);
      }}
    >
      Standalone toast
    </Toast>
  );
};

export const TestToast = () => (
  <CunninghamProvider currentLocale="en-US">
    <ToastControls />
  </CunninghamProvider>
);

export const TestStandaloneToast = () => (
  <CunninghamProvider currentLocale="en-US">
    <StandaloneToast />
  </CunninghamProvider>
);
