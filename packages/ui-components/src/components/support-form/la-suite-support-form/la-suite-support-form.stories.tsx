import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ":/cunningham";
import { LaSuiteSupportForm } from "./LaSuiteSupportForm";
import { LaSuiteSupportFormProps } from "./types";
import {
  installMockLaSuiteSupportApi,
  MOCK_LA_SUITE_SUPPORT_API,
} from "./mockLaSuiteSupportApi";

installMockLaSuiteSupportApi();

const meta = {
  title: "Components/SupportForm/LaSuiteSupportForm",
  component: LaSuiteSupportForm,
  tags: ["autodocs"],
  parameters: {
    // The stories open their popover on load: on the docs page, each one gets
    // its own frame so the popovers don't pile up over the page.
    docs: { story: { inline: false, height: "720px" } },
  },
  args: {
    api: MOCK_LA_SUITE_SUPPORT_API,
    channel: "docs",
  },
} satisfies Meta<typeof LaSuiteSupportForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const LaSuiteSupportFormWrapper = (
  props: Omit<LaSuiteSupportFormProps, "children">,
) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <LaSuiteSupportForm {...props} isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(!isOpen)}>Contact us</Button>
    </LaSuiteSupportForm>
  );
};

/**
 * Connected to a fake support API. Write "error" in the subject to see how a
 * refused request is shown.
 */
export const Default: Story = {
  render: (args) => (
    <LaSuiteSupportFormWrapper
      {...args}
      onSuccess={() => console.log("Support request sent")}
      onError={(error) => console.log("Support request failed", error)}
    />
  ),
};

/** The app knows the user's email: the form does not ask for it. */
export const KnownEmail: Story = {
  render: (args) => (
    <LaSuiteSupportFormWrapper {...args} email="jean.dupont@example.gouv.fr" />
  ),
};
