/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { HeaderBanner } from "./HeaderBanner";
import { MainLayout } from "../layout/MainLayout";
import svg from "../layout/header/logo-example.svg";

const meta: Meta<typeof HeaderBanner> = {
  title: "Components/HeaderBanner",
  component: HeaderBanner,
  tags: ["autodocs"],
  args: {
    label: "You are on a development version",
    color: "brand",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["brand", "error", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderBanner>;

export const Info: Story = {
  args: {
    color: "brand",
    label: "You are on a development version",
    ctaProps: { label: "Prod version", href:"https://example.com" },
    onClose: () => {},
  },
};

export const Error: Story = {
  args: {
    color: "error",
    label: "There are issues accessing the service. Resolution expected today at 1:00 p.m.",
    ctaProps: { label: "Read more", href:"https://example.com" },
    onClose: () => {},
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
    label: "An update is scheduled for today at 1 p.m. The service shall be operational at 1:20 p.m.",
    ctaProps: { label: "Read more", href:"https://example.com" },
    onClose: () => {},
  },
};

export const LabelOnly: Story = {
  args: {
    label: "You are on a development version",
  },
};

export const WithCloseOnly: Story = {
  args: {
    label: "You are on a development version",
    onClose: () => {},
  },
};

export const WithButtonCTA: Story = {
    args: {
    label: "A new version is available.",
    ctaProps: { label: "Reload" },
    onClose: () => {},
  },
};

export const All: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <HeaderBanner
        color="brand"
        label="You are on a development version"
        ctaProps={{ label: "Prod version", href:"https://example.com" }}
        onClose={() => {}}
      />
      <HeaderBanner
        color="error"
        label="There are issues accessing the service. Resolution expected today at 1:00 p.m."
        ctaProps={{ label: "Read more", href:"https://example.com" }}
        onClose={() => {}}
      />
      <HeaderBanner
        color="warning"
        label="An update is scheduled for today at 1 p.m. The service shall be operational at 1:20 p.m."
        ctaProps={{ label: "Read more", href:"https://example.com" }}
        onClose={() => {}}
      />
    </div>
  ),
};

// The banner sits above the whole application thanks to the `topBanner` prop of
// `MainLayout`, which offsets the layout (and its fixed header) by the banner
// height. Closing the banner gives the space back to the layout.
export const AboveLayout: Story = {
  name: "Above the layout",
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [isBannerOpen, setIsBannerOpen] = useState(true);
    return (
      <MainLayout
        topBanner={
          isBannerOpen && (
            <HeaderBanner
              color="warning"
              label="An update is scheduled for today at 1 p.m. The service shall be operational at 1:20 p.m."
              ctaProps={{ label: "Read more", href: "https://example.com" }}
              onClose={() => setIsBannerOpen(false)}
            />
          )
        }
        icon={<img src={svg} alt="logo" />}
        languages={[
          { label: "Français", isChecked: true },
          { label: "Anglais" },
        ]}
        leftPanelContent={
          <div style={{ padding: "1rem" }}>Left panel content</div>
        }
      >
        <div style={{ padding: "1rem" }}>Main content area</div>
      </MainLayout>
    );
  },
};
