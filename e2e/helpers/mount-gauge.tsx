import { useState } from "react";
import { Modal, ModalSize } from "@gouvfr-lasuite/cunningham-react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import {
  StorageGauge,
  StorageGaugeProps,
} from "../../src/components/storage-gauge/StorageGauge";
import {
  StorageGaugeDetails,
  StorageGaugeDetailsProps,
} from "../../src/components/storage-gauge/StorageGaugeDetails";
import { BottomMenu } from "../../src/components/bottom-menu/BottomMenu";

export const TestStorageGauge = (props: StorageGaugeProps) => (
  <CunninghamProvider currentLocale="en-US">
    <StorageGauge {...props} />
  </CunninghamProvider>
);

export const TestStorageGaugeDetails = (props: StorageGaugeDetailsProps) => (
  <CunninghamProvider currentLocale="en-US">
    <StorageGaugeDetails {...props} />
  </CunninghamProvider>
);

type TestBottomMenuGaugeProps = {
  used: number;
  total: number;
  unit?: string;
  withSettings?: boolean;
};

/**
 * Bottom menu whose gauge opens a modal containing the gauge details.
 * The modal state lives here (in the browser) because Playwright CT cannot
 * bridge callbacks from the test file.
 */
export const TestBottomMenuGauge = ({
  used,
  total,
  unit = "GB",
  withSettings = true,
}: TestBottomMenuGaugeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CunninghamProvider currentLocale="en-US">
      <BottomMenu
        onSettings={withSettings ? () => undefined : undefined}
        gauge={{ used, total, unit, onClick: () => setIsOpen(true) }}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Storage"
        size={ModalSize.SMALL}
      >
        <div style={{ padding: 16 }}>
          <StorageGaugeDetails
            used={used}
            total={total}
            unit={unit}
            info="Useful info"
            action={{ label: "More info", href: "https://example.com" }}
          />
        </div>
      </Modal>
    </CunninghamProvider>
  );
};
