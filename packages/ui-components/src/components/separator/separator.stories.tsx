import type { Meta, StoryObj } from "@storybook/react";

import { HorizontalSeparator } from "./HorizontalSeparator";
import { VerticalSeparator } from "./VerticalSeparator";
import { _AbstractSeparator } from "./AbstractSeparator";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Separator",
  component: _AbstractSeparator,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof _AbstractSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    withPadding: true,
    direction: "horizontal",
    width: "thin",
  },
  render: (args) => {
    const { direction, ...rest } = args;
    if (direction === "horizontal") {
      return (
        <div>
          <div>Item 1</div>
          <HorizontalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div>Item 1</div>
          <VerticalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    }
  },
};

export const Horizontal: Story = {
  args: {
    direction: "horizontal",
  },
  render: () => {
    return (
      <div>
        <div>Up</div>
        <HorizontalSeparator />
        <div>Down</div>
      </div>
    );
  },
};

export const Vertical: Story = {
  args: {
    direction: "vertical",
  },
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <div>Left</div>
        <VerticalSeparator />
        <div>Right</div>
      </div>
    );
  },
};

export const DoubleWidth: Story = {
  args: {
    direction: "horizontal",
    width: "double",
  },
  render: (args) => {
    const { direction, ...rest } = args;
    if (direction === "horizontal") {
      return (
        <div>
          <div>Item 1</div>
          <HorizontalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div>Item 1</div>
          <VerticalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    }
  },
};

export const withPadding: Story = {
  args: {
    direction: "horizontal",
    withPadding: true,
  },
  render: (args) => {
    const { direction, ...rest } = args;
    if (direction === "horizontal") {
      return (
        <div>
          <div>Item 1</div>
          <HorizontalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div>Item 1</div>
          <VerticalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    }
  },
};

export const CustomSize: Story = {
  args: {
    direction: "horizontal",
    size: '150px',
  },
  render: (args) => {
    const { direction, ...rest } = args;
    if (direction === "horizontal") {
      return (
        <div>
          <div>Item 1</div>
          <HorizontalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div>Item 1</div>
          <VerticalSeparator {...rest} />
          <div>Item 2</div>
        </div>
      );
    }
  },
};
