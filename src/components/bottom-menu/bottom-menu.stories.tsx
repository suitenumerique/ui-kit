/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal, ModalSize } from "@gouvfr-lasuite/cunningham-react";
import { BottomMenu } from "./BottomMenu";
import { StorageGaugeDetails } from "../storage-gauge/StorageGaugeDetails";
import { MainLayout } from "../layout/MainLayout";
import svg from "../layout/header/logo-example.svg";

const meta: Meta<typeof BottomMenu> = {
  title: "Components/BottomMenu",
  component: BottomMenu,
  decorators: [
    (Story) => (
      <div style={{ width: 300, padding: 12 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const helpConfig = {
  documentationUrl: "https://example.com/docs",
  onOnboarding: () => alert("Onboarding"),
};

/** Full bottom menu: help, settings and a clickable storage gauge. */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <BottomMenu
          help={helpConfig}
          onSettings={() => alert("Settings")}
          gauge={{
            used: 1.8,
            total: 10,
            unit: "GB",
            onClick: () => setIsOpen(true),
          }}
        />
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Storage"
          size={ModalSize.SMALL}
        >
          <div style={{ padding: 16 }}>
            <StorageGaugeDetails used={1.8} total={10} unit="GB" />
          </div>
        </Modal>
      </>
    );
  },
};

/** Gauge only (no help, no settings). */
export const GaugeOnly: Story = {
  args: {
    gauge: { used: 9.1, total: 10, unit: "GB" },
  },
};

/** Actions only (no gauge). */
export const ActionsOnly: Story = {
  args: {
    help: helpConfig,
    onSettings: () => alert("Settings"),
  },
};

/** Bottom menu placed in the MainLayout left panel footer. */
export const WithLayout: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: () => {
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <MainLayout
          icon={<img src={svg} alt="logo" />}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
          languages={[
            { label: "Français", isChecked: true },
            { label: "English" },
          ]}
          leftPanelContent={<div style={{ padding: "1rem" }}>Left panel</div>}
          leftPanelFooter={
            <div style={{ padding: "0.5rem 0.75rem" }}>
              <BottomMenu
                help={helpConfig}
                onSettings={() => alert("Settings")}
                gauge={{
                  used: 1.8,
                  total: 10,
                  unit: "GB",
                  onClick: () => setIsOpen(true),
                }}
              />
            </div>
          }
        >
          <div style={{ padding: "1rem" }}>Main content</div>
        </MainLayout>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Storage"
          size={ModalSize.SMALL}
        >
          <div style={{ padding: 16 }}>
            <StorageGaugeDetails used={1.8} total={10} unit="GB" />
          </div>
        </Modal>
      </>
    );
  },
};
