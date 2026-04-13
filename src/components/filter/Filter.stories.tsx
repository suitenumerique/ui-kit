import type { Meta, StoryObj } from "@storybook/react";

import { Filter, FilterOption } from "./Filter";
import { useState } from "react";
import { Key } from "react-aria-components";
import { Button } from "@gouvfr-lasuite/cunningham-react";

const meta: Meta<typeof Filter> = {
  title: "Components/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "3em" }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS: FilterOption[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "File",
    value: "file",
  },
  {
    label: "Folder",
    value: "folder",
  },
];

const OPTIONS_CUSTOM: FilterOption[] = [
  {
    label: "File",
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">file_present</span> File
      </div>
    ),
    value: "file",
  },
  {
    label: "Folder",
    value: "folder",
    showSeparator: true,

    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">folder</span> Folder
      </div>
    ),
  },
  {
    label: "Reset",
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">all_inclusive</span> All
      </div>
    ),
    value: "all",
  },
];

export const Uncontrolled: Story = {
  args: {
    label: "Type",
    options: OPTIONS,
  },
};

export const UncontrolledWithDefault: Story = {
  args: {
    label: "Type",
    defaultSelectedKey: "folder",
    options: OPTIONS,
  },
};

const OPTIONS_LONG: FilterOption[] = [
  {
    label: "Tous les documents disponibles",
    value: "all",
  },
  {
    label: "Fichiers partagés avec mon équipe",
    value: "file",
  },
  {
    label: "Dossiers récemment modifiés par un collaborateur",
    value: "folder",
  },
];

export const LongLabels: Story = {
  args: {
    label: "Type de contenu à afficher dans la liste",
    options: OPTIONS_LONG,
  },
};

export const MultipleInConstrainedContainer: Story = {
  render: () => (
    <div
      style={{
        maxWidth: "600px",
        border: "1px solid #ccc",
        padding: "1em",
        display: "flex",
        gap: "1em",
        alignItems: "center",
        overflowX: "auto",
      }}
    >
      <Filter
        label="Type de contenu à afficher"
        defaultSelectedKey="folder"
        options={[
          { label: "Dossier partagé avec l'équipe", value: "folder" },
          { label: "Fichier récemment modifié", value: "file" },
        ]}
      />
      <Filter
        label="Espace de travail collaboratif"
        defaultSelectedKey="public"
        options={[
          { label: "Espace public accessible à tous", value: "public" },
          { label: "Espace privé réservé aux membres", value: "private" },
        ]}
      />
      <Filter
        label="Emplacement du document dans l'arborescence"
        defaultSelectedKey="trash"
        options={[
          { label: "Corbeille des éléments supprimés", value: "trash" },
          { label: "Favoris marqués par l'utilisateur", value: "favorites" },
        ]}
      />
      <Button size="small">Réinitialiser</Button>
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    label: "Type",
    options: OPTIONS_CUSTOM,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<Key | null>("folder");
    return (
      <div>
        <Filter
          {...args}
          selectedKey={selected}
          onSelectionChange={(key) => {
            if (key === "all") {
              setSelected(null);
            } else {
              setSelected(key);
            }
          }}
        />
        <div style={{ display: "flex", gap: "1em", marginTop: "1em" }}>
          <Button size="small" onClick={() => setSelected(null)}>
            Reset
          </Button>
          <Button
            size="small"
            onClick={() =>
              setSelected(
                OPTIONS_CUSTOM[
                  Math.floor(Math.random() * OPTIONS_CUSTOM.length)
                ].value as Key
              )
            }
          >
            Random
          </Button>
        </div>
      </div>
    );
  },
};
