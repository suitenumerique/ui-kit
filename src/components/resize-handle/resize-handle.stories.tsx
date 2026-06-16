import { Meta, StoryObj } from "@storybook/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// Reusable styling for a `react-resizable-panels` resize handle.
// See ResizeHandle.mdx for the full documentation.
const meta: Meta = {
  title: "Components/ResizeHandle",
};

export default meta;

const panelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--c--contextuals--background--surface--secondary)",
  color: "var(--c--contextuals--content--semantic--neutral--primary)",
};

const frameStyle: React.CSSProperties = {
  height: 240,
  width: 480,
  border: "1px solid var(--c--contextuals--border--surface--primary)",
};

// --- Vertical handle: panels laid out side by side (drag left/right) ---
export const Interactive: StoryObj = {
  render: () => (
    <div style={frameStyle}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={20}>
          <div style={panelStyle}>Left</div>
        </Panel>
        <PanelResizeHandle className="c__resize-handle c__resize-handle--interactive" />
        <Panel minSize={20}>
          <div style={panelStyle}>Right</div>
        </Panel>
      </PanelGroup>
    </div>
  ),
};

// --- Horizontal handle: stacked panels (drag up/down) ---
export const InteractiveVertical: StoryObj = {
  render: () => (
    <div style={frameStyle}>
      <PanelGroup direction="vertical">
        <Panel defaultSize={50} minSize={20}>
          <div style={panelStyle}>Top</div>
        </Panel>
        <PanelResizeHandle className="c__resize-handle c__resize-handle--interactive" />
        <Panel minSize={20}>
          <div style={panelStyle}>Bottom</div>
        </Panel>
      </PanelGroup>
    </div>
  ),
};

// --- Static line: no hover affordance (resizing disabled) ---
export const Static: StoryObj = {
  render: () => (
    <div style={frameStyle}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50}>
          <div style={panelStyle}>Left</div>
        </Panel>
        <PanelResizeHandle className="c__resize-handle" disabled />
        <Panel>
          <div style={panelStyle}>Right</div>
        </Panel>
      </PanelGroup>
    </div>
  ),
};
