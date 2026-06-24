import type { Meta, StoryObj } from "@storybook/react";
import { SmartScroller } from "./SmartScroller";

const meta: Meta<typeof SmartScroller> = {
  title: "Components/SmartScroller",
  component: SmartScroller,
  argTypes: {
    children: {
      description: "The content laid out as a horizontally scrollable row.",
      control: false,
      table: { type: { summary: "React.ReactNode" } },
    },
    className: {
      description: "Custom CSS class applied to the root element.",
      table: { type: { summary: "string" } },
    },
    scrollRatio: {
      description:
        "Fraction of the visible width scrolled on each arrow click " +
        "(e.g. 0.5 = half the viewport, 1 = a full page).",
      table: { type: { summary: "number" }, defaultValue: { summary: "0.5" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SmartScroller>;

const frameStyle: React.CSSProperties = {
  width: 480,
  marginBottom: 32,
  border: "1px solid var(--c--contextuals--border--surface--primary)",
  borderRadius: 8,
  padding: 8,
};

const chipStyle: React.CSSProperties = {
  flex: "0 0 auto",
  height: 40,
  paddingInline: 20,
  marginInline: 4,
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  borderRadius: 20,
  background: "var(--c--contextuals--background--surface--secondary)",
  color: "var(--c--contextuals--content--semantic--neutral--primary)",
};

const Chips = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} style={chipStyle}>
        Item {i + 1}
      </div>
    ))}
  </>
);

// Many items overflow the frame: the right arrow shows immediately, scrolling
// reveals the left arrow, and reaching the end hides the right arrow.
export const Overflowing: Story = {
  render: () => (
    <div style={frameStyle}>
      <SmartScroller>
        <Chips count={15} />
      </SmartScroller>
    </div>
  ),
};

// Few items that fit within the frame: no arrows are rendered.
export const NoOverflow: Story = {
  render: () => (
    <div style={frameStyle}>
      <SmartScroller>
        <Chips count={3} />
      </SmartScroller>
    </div>
  ),
};

// Resize the frame (drag its bottom-right corner) to confirm the arrows
// recompute as the available width changes.
export const Resizable: Story = {
  render: () => (
    <div style={{ ...frameStyle, resize: "horizontal", overflow: "auto" }}>
      <SmartScroller>
        <Chips count={15} />
      </SmartScroller>
    </div>
  ),
};
