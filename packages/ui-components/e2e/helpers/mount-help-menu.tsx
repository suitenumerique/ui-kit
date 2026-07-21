import { CunninghamProvider } from "../../src/components/Provider/Provider";
import {
  HelpMenu,
  HelpMenuProps,
} from "../../src/components/help-menu/HelpMenu";
import type { DropdownMenuItem } from "../../src/components/dropdown-menu/types";
import type { SupportedLocale } from "../../src/types/translations";
import { useEffect } from "react";

// Playwright CT bridges function props as one-way dispatchers, and nested
// functions (inside arrays/objects) don't survive the bridge at all. So tests
// describe scenarios with plain serializable data and this helper — which runs
// in the browser — builds the real callbacks locally. Callback invocations are
// recorded on `window.__helpMenuCalls` so tests can assert them via
// `page.evaluate`. Links that open a new tab are asserted via the browser
// context "page" event instead.

declare global {
  interface Window {
    __helpMenuCalls: string[];
  }
}

type TestCustomOption = {
  label: string;
  url?: string;
  testId?: string;
};

interface TestHelpMenuProps {
  locale?: SupportedLocale;
  documentationUrl?: string;
  withOnboarding?: boolean;
  withContactUs?: boolean;
  withFeedbackForm?: boolean;
  release?: HelpMenuProps["release"];
  legal?: HelpMenuProps["legal"];
  customOptions?: TestCustomOption[];
}

export const TestHelpMenu = ({
  locale = "en-US",
  documentationUrl,
  withOnboarding,
  withContactUs,
  withFeedbackForm,
  release,
  legal,
  customOptions,
}: TestHelpMenuProps) => {
  useEffect(() => {
    window.__helpMenuCalls = [];
  }, []);
  const record = (name: string) => window.__helpMenuCalls.push(name);

  const builtCustomOptions: DropdownMenuItem[] | undefined = customOptions?.map(
    (option) => ({
      label: option.label,
      testId: option.testId,
      opensInNewWindow: !!option.url,
      callback: () => {
        record(`custom:${option.label}`);
        if (option.url) {
          window.open(option.url, "_blank", "noopener,noreferrer");
        }
      },
    }),
  );

  return (
    <CunninghamProvider currentLocale={locale}>
      <HelpMenu
        documentationUrl={documentationUrl}
        onOnboarding={withOnboarding ? () => record("onboarding") : undefined}
        onContactUs={withContactUs ? () => record("contactUs") : undefined}
        feedbackForm={
          withFeedbackForm
            ? { onSend: () => record("feedback:send") }
            : undefined
        }
        release={release}
        legal={legal}
        customOptions={builtCustomOptions}
      />
    </CunninghamProvider>
  );
};
