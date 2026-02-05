import { useState, type ComponentType, type SVGProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconModules = import.meta.glob<Record<string, IconComponent>>(
  "./*.tsx",
  { eager: true },
);

const icons: { name: string; Component: IconComponent }[] = [];
for (const [path, mod] of Object.entries(iconModules)) {
  if (path === "./Icons.stories.tsx") continue;
  const name = path.replace("./", "").replace(".tsx", "");
  const Component = mod[name];
  if (Component) {
    icons.push({ name, Component });
  }
}
icons.sort((a, b) => a.name.localeCompare(b.name));

const meta = {
  title: "Components/Icon/Icons",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => {
    const [search, setSearch] = useState("");

    const filtered = search
      ? icons.filter((i) =>
          i.name.toLowerCase().includes(search.toLowerCase()),
        )
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
  },
};
