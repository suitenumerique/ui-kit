import {
  Button,
  Input,
  Modal,
  ModalSize,
  useModal,
} from "@openfun/cunningham-react";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Modal",
  component: Modal,
  args: {
    children: "Description",
    title: "Title",
    isOpen: false,
    onClose: () => {},
  },
  decorators: [
    (Story, context) => {
      const modal = useModal();

      useEffect(() => {
        modal.open();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <>
          <Button onClick={() => modal.open()}>Open Modal</Button>
          <Story args={{ ...context.args, ...modal }} />
        </>
      );
    },
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExampleCreateFolder: Story = {
  args: {
    size: ModalSize.SMALL,
    children: (
      <form className="mt-s">
        <Input
          label="Create folder"
          fullWidth={true}
          defaultValue="My Folder"
        />
      </form>
    ),
    rightActions: (
      <>
        <Button color="secondary">Cancel</Button>
        <Button type="submit">Submit</Button>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: ModalSize.SMALL,
  },
};
export const Medium: Story = {
  args: {
    size: ModalSize.MEDIUM,
  },
};

export const Large: Story = {
  args: {
    size: ModalSize.LARGE,
  },
};
export const ExtraLarge: Story = {
  args: {
    size: ModalSize.EXTRA_LARGE,
  },
};
export const Full: Story = {
  args: {
    size: ModalSize.FULL,
  },
};

export const HideCloseButton: Story = {
  args: {
    size: ModalSize.MEDIUM,
    hideCloseButton: true,
  },
};
export const CloseOnClickOutside: Story = {
  args: {
    size: ModalSize.MEDIUM,
    hideCloseButton: true,
    closeOnClickOutside: true,
  },
};
export const DontCloseOnEsc: Story = {
  args: {
    size: ModalSize.MEDIUM,
    closeOnEsc: false,
  },
};
export const PreventClose: Story = {
  args: {
    size: ModalSize.MEDIUM,
    preventClose: true,
  },
};

export const ExampleApplication: Story = {
  args: {
    size: ModalSize.LARGE,
    title: "Application successful",
    titleIcon: <span className="material-icons clr-success-600">done</span>,
    children: (
      <>
        Thank you for submitting your application! Your information has been
        received successfully. <br />
        <br />
        You will receive a confirmation email shortly with the details of your
        submission. If there are any further steps required our team will be in
        touch.
      </>
    ),
    rightActions: <Button color="primary">I understand</Button>,
  },
};
