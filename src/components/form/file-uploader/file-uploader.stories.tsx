/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import { Button, Modal, ModalSize } from "@gouvfr-lasuite/cunningham-react";
import { FileUploader, FileUploaderProps } from "./FileUploader";
import { UploadFile } from "./types";

const GB = 1000 * 1000 * 1000;
const MB = 1000 * 1000;

const createFileFixture = (name: string, size = 0, type = "") => {
  const file = new File([], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

const InteractiveUploader = (props: FileUploaderProps) => {
  const [files, setFiles] = useState<UploadFile[]>(props.files ?? []);

  return (
    <FileUploader
      {...props}
      files={files}
      onAddFiles={(nextFiles) => {
        props.onAddFiles?.(nextFiles);
        setFiles(nextFiles);
      }}
      onRemoveFile={(file) => {
        props.onRemoveFile?.(file);
        setFiles((previousFiles) =>
          previousFiles.filter((item) => item.id !== file.id),
        );
      }}
      onCancelFile={(file) => {
        props.onCancelFile?.(file);
        setFiles((previousFiles) =>
          previousFiles.filter((item) => item.id !== file.id),
        );
      }}
    />
  );
};

type SimulatedUploadFile = UploadFile & {
  outcome?: "done" | "error";
};

const createSimulatedUploadFiles = (): SimulatedUploadFile[] => [
  {
    id: "simulated-upload",
    originalFile: createFileFixture(
      "Presentation on Monet.pptx",
      12 * MB,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ),
    status: "uploading",
    progress: 24,
    outcome: "done",
  },
  {
    id: "simulated-error",
    originalFile: createFileFixture(
      "Flower wallpaper.jpg",
      8 * MB,
      "image/jpeg",
    ),
    status: "error",
    error: "The upload failed",
    errorDetails: "The file could not be uploaded. Please try again.",
  },
];

const SimulatedUploader = (props: FileUploaderProps) => {
  const [files, setFiles] = useState<SimulatedUploadFile[]>(
    createSimulatedUploadFiles,
  );
  const nextUploadIndex = useRef(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFiles((previousFiles) =>
        previousFiles.map((file) => {
          if (file.status !== "uploading") {
            return file;
          }

          const progress = Math.min((file.progress ?? 0) + 1, 100);
          if (file.outcome === "error" && progress >= 75) {
            return {
              ...file,
              status: "error",
              progress: undefined,
              error: "The upload failed",
              errorDetails: "The file could not be uploaded. Please try again.",
            };
          }
          if (progress === 100) {
            return {
              ...file,
              status: "done",
              progress: undefined,
            };
          }
          return { ...file, progress };
        }),
      );
    }, 100);

    return () => window.clearInterval(intervalId);
  }, []);

  const resetSimulation = () => {
    nextUploadIndex.current = 0;
    setFiles(createSimulatedUploadFiles());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Button size="small" variant="secondary" onClick={resetSimulation}>
        Restart simulation
      </Button>
      <FileUploader
        {...props}
        multiple
        files={files}
        onAddFiles={(nextFiles) => {
          props.onAddFiles?.(nextFiles);
          setFiles((previousFiles) => {
            const previousFilesById = new Map(
              previousFiles.map((file) => [file.id, file]),
            );

            return nextFiles.map((file) => {
              const previousFile = previousFilesById.get(file.id);
              if (previousFile) {
                return previousFile;
              }

              const index = nextUploadIndex.current++;
              return {
                ...file,
                status: "uploading" as const,
                progress: 0,
                outcome:
                  index % 2 === 0 ? ("done" as const) : ("error" as const),
              };
            });
          });
        }}
        onRemoveFile={(file) => {
          props.onRemoveFile?.(file);
          setFiles((previousFiles) =>
            previousFiles.filter((item) => item.id !== file.id),
          );
        }}
        onCancelFile={(file) => {
          props.onCancelFile?.(file);
          setFiles((previousFiles) =>
            previousFiles.filter((item) => item.id !== file.id),
          );
        }}
      />
    </div>
  );
};

const meta: Meta<typeof FileUploader> = {
  title: "Components/Forms/FileUploader",
  component: FileUploader,
  parameters: {
    docs: {
      description: {
        component:
          "Controlled file uploader with single and multiple modes. The consumer owns upload state and receives the next UploadFile collection through onAddFiles.",
      },
    },
  },
  argTypes: {
    name: {
      control: "text",
      description: "Name forwarded to the native file input.",
    },
    files: {
      control: false,
      description: "Controlled files and their current upload states.",
    },
    multiple: {
      control: "boolean",
      description: "Allows selecting and displaying multiple files.",
    },
    accept: {
      control: "text",
      description: "Accepted MIME types or file extensions.",
    },
    maxSize: {
      control: "number",
      description: "Maximum file size in bytes, displayed as a hint.",
    },
    disabled: {
      control: "boolean",
      description: "Disables selection and drag-and-drop interactions.",
    },
    onAddFiles: {
      control: false,
      description:
        "Called with the next controlled UploadFile collection after a selection or drop.",
    },
    onRemoveFile: {
      control: false,
      description: "Called when a completed or pending file is removed.",
    },
    onCancelFile: {
      control: false,
      description: "Called when an in-progress upload is cancelled.",
    },
    labels: {
      control: "object",
      description: "Overrides the translated uploader labels.",
    },
    className: {
      control: "text",
      description: "Additional class applied to the uploader root.",
    },
  },
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

/** Interactive single-file uploader, initially empty. */
export const Empty: Story = {
  render: (args) => <InteractiveUploader {...args} />,
};

export const SingleUploading: Story = {
  args: {
    files: [
      {
        id: "1",
        originalFile: createFileFixture("my_outline_export.zip", 248 * MB),
        status: "uploading",
      },
    ],
    onCancelFile: () => undefined,
  },
};

export const SingleDone: Story = {
  args: {
    files: [
      {
        id: "1",
        originalFile: createFileFixture("my_outline_export.zip", 248 * MB),
        status: "done",
      },
    ],
    onRemoveFile: () => undefined,
  },
};

export const SingleError: Story = {
  args: {
    files: [
      {
        id: "1",
        originalFile: createFileFixture("wallpaper.jpg", 6 * GB, "image/jpeg"),
        status: "error",
        error: "File exceeds the 5 GB limit",
      },
    ],
    onRemoveFile: () => undefined,
  },
};

/** Multiple-file populated state matching the Figma upload list. */
export const MultipleStates: Story = {
  args: {
    multiple: true,
    files: [
      {
        id: "1",
        originalFile: createFileFixture(
          "Presentation on Monet",
          12 * GB,
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ),
        status: "done",
      },
      {
        id: "2",
        originalFile: createFileFixture("Flower wallpaper", 0, "image/png"),
        status: "uploading",
        progress: 78,
      },
      {
        id: "3",
        originalFile: createFileFixture(
          "Seminar Logistics",
          2 * MB,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
        status: "done",
      },
      {
        id: "4",
        originalFile: createFileFixture(
          "Essay on the Vosges",
          10 * MB,
          "application/pdf",
        ),
        status: "done",
      },
    ],
  },
};

/** Fully interactive multi-upload: pick files to populate the list. */
export const InteractiveMultiple: Story = {
  render: (args) => <InteractiveUploader {...args} multiple />,
};

/**
 * Simulates upload progress locally. The initial uploading row can be
 * cancelled, and newly selected files alternate between success and error.
 */
export const SimulatedUpload: Story = {
  render: (args) => <SimulatedUploader {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Starts with an active upload and an error. Cancel the active row, restart the simulation, or select files: new uploads alternate between success and failure.",
      },
    },
  },
};

/** Upload module inside a modal. */
export const InModal: Story = {
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
              onAddFiles={setFiles}
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
