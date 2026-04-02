import { useState, type ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconSvg, type IconSvgProps } from "./IconSvg";
import { IconSize } from "./types";
import { Star } from "./icons/Star";

type IconComponent = ComponentType<IconSvgProps>;

const iconModules = import.meta.glob<Record<string, IconComponent>>(
  "./icons/*.tsx",
  {
    eager: true,
  },
);

const icons: { name: string; Component: IconComponent }[] = [];
for (const [path, mod] of Object.entries(iconModules)) {
  const name = path.replace("./icons/", "").replace(".tsx", "");
  const Component = mod[name];
  if (Component) {
    icons.push({ name, Component });
  }
}
icons.sort((a, b) => a.name.localeCompare(b.name));

const meta = {
  title: "Components/Icon/Svg Icons",
  component: IconSvg,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xsmall", "small", "medium", "large", "xlarge"],
      description: "The size of the icon",
    },
    color: { table: { disable: true } },
  },
} satisfies Meta<typeof IconSvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Star size={IconSize.X_SMALL} />
      <Star size={IconSize.SMALL} />
      <Star size={IconSize.MEDIUM} />
      <Star size={IconSize.LARGE} />
      <Star size={IconSize.X_LARGE} />
      <Star size={84} />
    </div>
  ),
};

export const Colors: Story = {
  args: {
    size: IconSize.MEDIUM,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ color: "#e74c3c" }}>
        <Star size={args.size} />
      </div>
      <div style={{ color: "#f39c12" }}>
        <Star size={args.size} />
      </div>
      <div style={{ color: "#27ae60" }}>
        <Star size={args.size} />
      </div>
      <div style={{ color: "#3498db" }}>
        <Star size={args.size} />
      </div>
      <div style={{ color: "#9b59b6" }}>
        <Star size={args.size} />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    size: IconSize.MEDIUM,
  },
  render: (args) => <Star {...args} />,
};

const AllIcons = () => {
  const [search, setSearch] = useState("");

  const filtered = search
    ? icons.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : icons;

  return (
    <div>
      <input
        type="text"
        placeholder="Search icons…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          marginBottom: "24px",
          fontSize: "14px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map(({ name, Component }) => (
          <div
            key={name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            <Component width={32} height={32} />
            <span
              style={{
                fontSize: "11px",
                color: "#666",
                textAlign: "center",
                wordBreak: "break-word",
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: "24px", fontSize: "13px", color: "#999" }}>
        {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export const All: Story = {
  render: () => <AllIcons />,
};
