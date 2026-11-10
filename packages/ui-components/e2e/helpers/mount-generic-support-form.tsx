import { useEffect, useState } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import { GenericSupportForm } from "../../src/components/support-form/generic-support-form/GenericSupportForm";
import type { GenericSupportFormData } from "../../src/components/support-form/generic-support-form/types";

// Playwright CT can't pass real callbacks into the browser, so tests describe
// the scenario with plain data and this helper builds the callbacks here.
// Each call is recorded on `window.__genericSupportFormCalls` for `page.evaluate`.

export type RecordedCall =
  | {
      type: "send";
      data: Omit<GenericSupportFormData, "files"> & { files?: string[] };
    }
  | { type: "successClose" }
  | { type: "cancel" };

declare global {
  interface Window {
    __genericSupportFormCalls: RecordedCall[];
  }
}

const record = (call: RecordedCall) =>
  window.__genericSupportFormCalls.push(call);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface TestGenericSupportFormProps {
  /** What `onSend` does: return nothing, resolve, or reject. */
  sendOutcome?: "void" | "resolve" | "reject";
  rejectMessage?: string;
  sendDelayMs?: number;
  email?: string;
  requireEmail?: boolean;
  showEmailReply?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  uploadHint?: string;
}

export const TestGenericSupportForm = ({
  sendOutcome = "resolve",
  rejectMessage,
  sendDelayMs = 300,
  uploadHint,
  ...props
}: TestGenericSupportFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    window.__genericSupportFormCalls = [];
  }, []);

  const onSend = (data: GenericSupportFormData) => {
    record({
      type: "send",
      data: { ...data, files: data.files?.map((file) => file.name) },
    });
    if (sendOutcome === "void") return;
    return wait(sendDelayMs).then(() => {
      if (sendOutcome === "reject") {
        throw rejectMessage ? new Error(rejectMessage) : "no message";
      }
    });
  };

  return (
    <CunninghamProvider currentLocale="en-US">
      <GenericSupportForm
        {...props}
        labels={uploadHint ? { uploadHint } : undefined}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSend={onSend}
        onSuccessClose={() => record({ type: "successClose" })}
        onCancel={() => record({ type: "cancel" })}
      >
        <button type="button" onClick={() => setIsOpen(!isOpen)}>
          Open form
        </button>
      </GenericSupportForm>
    </CunninghamProvider>
  );
};
