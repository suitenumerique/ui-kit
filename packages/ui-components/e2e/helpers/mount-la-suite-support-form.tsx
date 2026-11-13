import { useEffect, useState } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import { LaSuiteSupportForm } from "../../src/components/support-form/la-suite-support-form/LaSuiteSupportForm";

// Playwright CT can't pass real callbacks into the browser, so this helper
// builds them here and records each call on `window.__laSuiteSupportFormCalls` for
// `page.evaluate`.

export type LaSuiteSupportFormCall =
  | { type: "success" }
  | { type: "error"; message: string };

declare global {
  interface Window {
    __laSuiteSupportFormCalls: LaSuiteSupportFormCall[];
  }
}

const record = (call: LaSuiteSupportFormCall) =>
  window.__laSuiteSupportFormCalls.push(call);

interface TestLaSuiteSupportFormProps {
  api: string;
  channel: string;
  email?: string;
}

export const TestLaSuiteSupportForm = (props: TestLaSuiteSupportFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    window.__laSuiteSupportFormCalls = [];
  }, []);

  return (
    <CunninghamProvider currentLocale="en-US">
      <LaSuiteSupportForm
        {...props}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => record({ type: "success" })}
        onError={(error) => record({ type: "error", message: error.message })}
      >
        <button type="button" onClick={() => setIsOpen(!isOpen)}>
          Open form
        </button>
      </LaSuiteSupportForm>
    </CunninghamProvider>
  );
};
