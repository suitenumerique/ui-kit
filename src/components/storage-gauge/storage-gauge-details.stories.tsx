/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button, Modal, ModalSize } from "@gouvfr-lasuite/cunningham-react";
import { StorageGaugeDetails } from "./StorageGaugeDetails";

const meta: Meta<typeof StorageGaugeDetails> = {
  title: "Components/StorageGauge/Details",
  component: StorageGaugeDetails,
  args: {
    used: 1.8,
    total: 10,
    unit: "GB",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInfoAndAction: Story = {
  args: {
    info: "Includes documents, attachments and trashed items.",
    action: {
      label: "More info",
      href: "https://example.com",
    },
  },
};

export const Warning: Story = {
  args: {
    used: 9.1,
    total: 10,
    info: "You are running low on storage.",
    action: { label: "More info", href: "https://example.com" },
  },
};

export const Full: Story = {
  args: {
    used: 10,
    total: 10,
    info: "Your storage is full.",
    action: { label: "More info", href: "https://example.com" },
  },
};

/** The gauge content displayed inside a modal alongside text and a control. */
export const InModal: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open storage modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Storage"
          size={ModalSize.SMALL}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 16,
            }}
          >
            <StorageGaugeDetails
              used={9.1}
              total={10}
              unit="GB"
              info="Includes documents, attachments and trashed items."
            />
            <p style={{ margin: 0, fontSize: 14, color: "#555e74" }}>
              Free up space by deleting files you no longer need, or upgrade
              your plan to get more storage.
            </p>
            <Button fullWidth>Manage storage</Button>
          </div>
        </Modal>
      </>
    );
  },
};
