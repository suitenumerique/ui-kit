/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { AccessRoleDropdown } from "./AccessRoleDropdown";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Share/AccessRoleDropdown",
  component: AccessRoleDropdown,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof AccessRoleDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedRole: "admin",
    roles: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
    onSelect: () => {},
    canUpdate: true,
    isOpen: false,
    onOpenChange: () => {},
  },
  parameters: {},
  render: (args) => {
    const [selectedRole, setSelectedRole] = useState(args.selectedRole);
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <AccessRoleDropdown
        selectedRole={selectedRole}
        roles={args.roles}
        onSelect={setSelectedRole}
        canUpdate={args.canUpdate}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    );
  },
};

export const WithDelete: Story = {
  args: {
    selectedRole: "editor",
    roles: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
    onSelect: () => {},
    canUpdate: true,
    isOpen: false,
    onOpenChange: () => {},
    onDelete: () => alert("Delete access"),
  },
  render: (args) => {
    const [selectedRole, setSelectedRole] = useState(args.selectedRole);
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <AccessRoleDropdown
        selectedRole={selectedRole}
        roles={args.roles}
        onSelect={setSelectedRole}
        canUpdate={args.canUpdate}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onDelete={args.onDelete}
      />
    );
  },
};
