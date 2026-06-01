/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { HeaderBanner } from "./HeaderBanner";
import { MainLayout } from "../layout/MainLayout";
import svg from "../layout/header/logo-example.svg";

const meta: Meta<typeof HeaderBanner> = {
  title: "Components/HeaderBanner",
  component: HeaderBanner,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    type: "info",
    children: "You are on a pre-production version.",
    action: {
      label: "Open the production version",
      href: "https://example.com",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Pre-production environment with a redirect link to production. */
export const PreProduction: Story = {};

/** Specific instance with a redirect link to the user's main instance. */
export const SpecificInstance: Story = {
  args: {
    type: "info",
    children: "You are on a session reserved for state agents.",
    action: {
      label: "Open the right session",
      href: "https://example.com",
    },
  },
};

/** Access issue or service instability with a link to more information. */
export const ServiceIssue: Story = {
  args: {
    type: "error",
    children:
      "There are issues accessing the service. Resolution expected today at 1:00 p.m.",
    action: {
      label: "Read more",
      href: "https://example.com",
    },
  },
};

/** Update warning that may cause disruptions. */
export const UpdateWarning: Story = {
  args: {
    type: "warning",
    children:
      "An update is scheduled for today at 1 p.m. The service shall be operational at 1:20 p.m.",
    action: {
      label: "Read more",
      href: "https://example.com",
    },
  },
};

/** Dismissible banner: the close button hides it (useful on small screens). */
export const Dismissible: Story = {
  args: {
    closable: true,
  },
};

/** Banner without any action, only a message. */
export const MessageOnly: Story = {
  args: {
    action: undefined,
    children: "Read-only mode is currently enabled on this workspace.",
  },
};

/** Action driven by a callback instead of a link. */
export const WithButtonAction: Story = {
  args: {
    closable: true,
    action: {
      label: "Retry now",
      onClick: () => alert("Retry clicked"),
      icon: null,
    },
  },
};

/** Long message to verify wrapping behaviour on narrow viewports. */
export const LongMessage: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    type: "warning",
    closable: true,
    children:
      "An update is scheduled for today at 1 p.m. The service shall be operational at 1:20 p.m. Please save your work before then to avoid losing any changes.",
  },
};

/**
 * Banner placed above the ui-kit MainLayout via its `topContent` slot. The
 * banner spans the full width and stays visible above the header.
 */
export const WithLayout: Story = {
  parameters: { layout: "fullscreen" },
  render: () => {
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    return (
      <MainLayout
        icon={<img src={svg} alt="logo" />}
        isLeftPanelOpen={isLeftPanelOpen}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
        languages={[
          { label: "Français", isChecked: true },
          { label: "English" },
        ]}
        leftPanelContent={<div style={{ padding: "1rem" }}>Left panel</div>}
        topContent={
          showBanner && (
            <HeaderBanner
              type="info"
              closable
              onClose={() => setShowBanner(false)}
              action={{
                label: "Open the production version",
                href: "https://example.com",
              }}
            >
              You are on a pre-production version.
            </HeaderBanner>
          )
        }
      >
        <div style={{ padding: "1rem" }}>
          <p>Main content area below the banner.</p>
        </div>
      </MainLayout>
    );
  },
};
