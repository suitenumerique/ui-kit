import { useEffect } from "react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import {
  StorageGaugeBar,
  StorageGaugeButton,
  StorageGaugeInformation,
} from "../../src/components/storage-gauge";
import type { SupportedLocale } from "../../src/types/translations";

// Playwright CT bridges function props as one-way dispatchers and drops
// ReactNode props entirely, so tests describe scenarios with plain serializable
// data and these helpers — which run in the browser — build the real callbacks
// and nodes locally. Callback invocations are recorded on
// `window.__storageGaugeCalls` so tests can assert them via `page.evaluate`.

declare global {
  interface Window {
    __storageGaugeCalls: string[];
  }
}

const useCallRecorder = () => {
  useEffect(() => {
    window.__storageGaugeCalls = [];
  }, []);
  return (name: string) => window.__storageGaugeCalls.push(name);
};

interface TestStorageGaugeBarProps {
  used: number;
  total: number;
}

export const TestStorageGaugeBar = ({
  used,
  total,
}: TestStorageGaugeBarProps) => (
  <CunninghamProvider currentLocale="en-US">
    <div style={{ display: "flex", width: "300px" }}>
      <StorageGaugeBar used={used} total={total} />
    </div>
  </CunninghamProvider>
);

interface TestStorageGaugeButtonProps {
  used: number;
  total: number;
  unit?: string;
  compact?: boolean;
  precision?: number;
  locked?: boolean;
  /** Renders custom locked content instead of the default warning icon. */
  withLockedContent?: boolean;
  /** Registers an onClick handler recorded as "click". */
  clickable?: boolean;
  locale?: SupportedLocale;
}

export const TestStorageGaugeButton = ({
  used,
  total,
  unit,
  compact,
  precision,
  locked,
  withLockedContent,
  clickable,
  locale = "en-US",
}: TestStorageGaugeButtonProps) => {
  const record = useCallRecorder();
  return (
    <CunninghamProvider currentLocale={locale}>
      <div style={{ width: "300px" }}>
        <StorageGaugeButton
          used={used}
          total={total}
          unit={unit}
          compact={compact}
          precision={precision}
          locked={locked}
          lockedContent={
            withLockedContent ? (
              <span data-testid="custom-locked">Quota exceeded</span>
            ) : undefined
          }
          onClick={clickable ? () => record("click") : undefined}
        />
      </div>
    </CunninghamProvider>
  );
};

interface TestStorageGaugeInformationProps {
  used: number;
  total: number;
  unit?: string;
  precision?: number;
  title?: string;
  label?: string;
  locked?: boolean;
  /** Registers an onMoreInfoClick handler recorded as "more-info". */
  withMoreInfo?: boolean;
  locale?: SupportedLocale;
}

export const TestStorageGaugeInformation = ({
  used,
  total,
  unit,
  precision,
  title,
  label,
  locked,
  withMoreInfo,
  locale = "en-US",
}: TestStorageGaugeInformationProps) => {
  const record = useCallRecorder();
  return (
    <CunninghamProvider currentLocale={locale}>
      <div style={{ width: "400px" }}>
        <StorageGaugeInformation
          used={used}
          total={total}
          unit={unit}
          precision={precision}
          title={title}
          label={label}
          locked={locked}
          onMoreInfoClick={withMoreInfo ? () => record("more-info") : undefined}
        />
      </div>
    </CunninghamProvider>
  );
};
