import type { Meta, StoryObj } from "@storybook/react";
import { UploadFileItem } from "./UploadFileItem";
import type { ResolvedUploadLabels, UploadFile } from "./types";
import "./upload-file-item.stories.scss";

const GB = 1000 * 1000 * 1000;

const createFileFixture = (name: string, size = 0, type = "") => {
  const file = new File([], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

const labels: ResolvedUploadLabels = {
  noFileYet: "No file yet",
  clickToUpload: "Click to upload",
  dragAndDrop: "or drag and drop",
  addFile: "Add a file",
  uploading: "Uploading",
  cancel: "Cancel",
  remove: "Delete",
  genericError: "An error occured",
};

const files = {
  done: {
    id: "done",
    originalFile: createFileFixture(
      "Presentation on Monet",
      12 * GB,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ),
    status: "done",
  },
  error: {
    id: "error",
    originalFile: createFileFixture(
      "Presentation on Monet",
      0,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ),
    status: "error",
    error: "An error occured",
  },
  errorWithDetails: {
    id: "error-with-details",
    originalFile: createFileFixture(
      "Presentation on Monet",
      0,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ),
    status: "error",
    error: "An error occured",
    errorDetails: "The file could not be uploaded. Please try again.",
  },
  uploading: {
    id: "uploading",
    originalFile: createFileFixture(
      "Presentation on Monet",
      0,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ),
    status: "uploading",
    progress: 78,
  },
} satisfies Record<string, UploadFile>;

const noop = () => undefined;

const RowPreview = ({
  file,
  hovered = false,
}: {
  file: UploadFile;
  hovered?: boolean;
}) => (
  <ul
    className={
      hovered
        ? "upload-file-item-story upload-file-item-story--hovered"
        : "upload-file-item-story"
    }
  >
    <UploadFileItem
      file={file}
      labels={labels}
      onRemove={file.status === "done" ? noop : undefined}
      onCancel={file.status === "uploading" ? noop : undefined}
    />
  </ul>
);

const meta = {
  title: "Components/Forms/FileUploader/Rows",
  component: UploadFileItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "File row used by FileUploader in multiple mode. It renders progress, completion, error and contextual actions from a controlled UploadFile.",
      },
    },
  },
  argTypes: {
    file: {
      control: false,
      description: "Native file and its controlled upload state.",
    },
    labels: {
      control: "object",
      description: "Resolved labels displayed by the row.",
    },
    onRemove: {
      control: false,
      description: "Called when the remove action is activated.",
    },
    onCancel: {
      control: false,
      description: "Called when the upload cancellation action is activated.",
    },
  },
  args: {
    file: files.done,
    labels,
  },
  decorators: [
    (Story) => (
      <div className="upload-file-item-story__viewport">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UploadFileItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <RowPreview file={files.done} />,
};

export const DefaultHover: Story = {
  render: () => <RowPreview file={files.done} hovered />,
};

export const Error: Story = {
  render: () => <RowPreview file={files.error} />,
};

export const ErrorWithDetails: Story = {
  render: () => <RowPreview file={files.errorWithDetails} />,
};

export const Uploading: Story = {
  render: () => <RowPreview file={files.uploading} />,
};

export const UploadingHover: Story = {
  render: () => <RowPreview file={files.uploading} hovered />,
};

export const AllStates: Story = {
  render: () => (
    <div className="upload-file-item-story__all-states">
      <RowPreview file={files.done} />
      <RowPreview file={files.done} hovered />
      <RowPreview file={files.error} />
      <RowPreview file={files.uploading} />
      <RowPreview file={files.uploading} hovered />
    </div>
  ),
};
