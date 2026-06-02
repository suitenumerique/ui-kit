/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button, Modal, ModalSize } from "@gouvfr-lasuite/cunningham-react";
import { FileUploader } from "./FileUploader";
import { UploadFile } from "./types";

const GB = 1024 * 1024 * 1024;
const MB = 1024 * 1024;

const meta: Meta<typeof FileUploader> = {
  title: "Components/Upload",
  component: FileUploader,
  args: {
    maxSize: 5 * GB,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 402 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Single-file empty dropzone. */
export const Empty: Story = {};

export const SingleUploading: Story = {
  args: {
    files: [
      { id: "1", name: "my_outline_export.zip", size: 248 * MB, status: "uploading" },
    ],
  },
};

export const SingleDone: Story = {
  args: {
    files: [
      { id: "1", name: "my_outline_export.zip", size: 248 * MB, status: "done" },
    ],
  },
};

export const SingleError: Story = {
  args: {
    files: [
      {
        id: "1",
        name: "huge.zip",
        size: 6 * GB,
        status: "error",
        error: "File exceeds the 5 GB limit",
      },
    ],
  },
};

/** Multiple files with a mix of statuses. */
export const MultipleStates: Story = {
  args: {
    multiple: true,
    files: [
      {
        id: "1",
        name: "Presentation on Monet",
        size: 12 * GB,
        status: "done",
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      },
      {
        id: "2",
        name: "Flower wallpaper",
        status: "uploading",
        type: "image/png",
      },
      {
        id: "3",
        name: "Seminar Logistics",
        size: 2 * MB,
        status: "done",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        id: "4",
        name: "Essay on the Vosges",
        size: 10 * MB,
        status: "error",
        error: "An error occurred",
        type: "application/pdf",
      },
    ],
  },
};

/** Fully interactive multi-upload: pick files to populate the list. */
export const InteractiveMultiple: StoryObj = {
  render: () => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    return (
      <FileUploader
        multiple
        maxSize={5 * GB}
        files={files}
        onAddFiles={(added) =>
          setFiles((prev) => [
            ...prev,
            ...added.map((f, i) => ({
              id: `${Date.now()}-${i}`,
              name: f.name,
              size: f.size,
              type: f.type,
              status: "done" as const,
            })),
          ])
        }
        onRemoveFile={(file) =>
          setFiles((prev) => prev.filter((f) => f.id !== file.id))
        }
      />
    );
  },
};

/** Upload module inside a modal. */
export const InModal: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState<UploadFile[]>([]);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open upload modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Upload files"
          size={ModalSize.MEDIUM}
        >
          <div style={{ padding: 16 }}>
            <FileUploader
              multiple
              maxSize={5 * GB}
              files={files}
              onAddFiles={(added) =>
                setFiles((prev) => [
                  ...prev,
                  ...added.map((f, i) => ({
                    id: `${Date.now()}-${i}`,
                    name: f.name,
                    size: f.size,
                    type: f.type,
                    status: "done" as const,
                  })),
                ])
              }
              onRemoveFile={(file) =>
                setFiles((prev) => prev.filter((f) => f.id !== file.id))
              }
            />
          </div>
        </Modal>
      </>
    );
  },
};
