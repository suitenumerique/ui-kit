import type { Meta, StoryObj } from "@storybook/react";
import { Title, Description, Controls, Stories } from "@storybook/blocks";
import { ToastProvider } from "./ToastProvider";
import { toast } from "./toast";
import { ArrowRight } from "../icon/icons/ArrowRight";

const meta: Meta<typeof ToastProvider> = {
  title: "Components/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Controls />
          <Stories />
        </>
      ),
      description: {
        component: `The Toast component displays brief notifications to the user. It wraps \`react-toastify\` with the design system's tokens and typography.

## Installation

Add the \`ToastProvider\` at the root of your app:

\`\`\`tsx
import { ToastProvider } from "@gouvfr-lasuite/ui-kit";

function App() {
  return (
    <>
      <MyApp />
      <ToastProvider />
    </>
  );
}
\`\`\`

## Basic usage

\`\`\`tsx
import { toast } from "@gouvfr-lasuite/ui-kit";

// Simple toast
toast.info("Document moved successfully.");

// Toast with icon, progress, and actions
toast.info("Document 1 moved to Document 2", {
  icon: <ArrowRight size={20} />,
  progress: 15,
  actions: [
    { label: "See", onClick: () => navigate("/document/2") },
    { label: "Cancel", onClick: () => undoMove() },
  ],
});
\`\`\`

## API

| Method | Description |
|--------|-------------|
| \`toast(message, options?)\` | Default toast |
| \`toast.info(message, options?)\` | Info variant (blue) |
| \`toast.success(message, options?)\` | Success variant (green) |
| \`toast.warning(message, options?)\` | Warning variant (orange) |
| \`toast.error(message, options?)\` | Error variant (red) |
| \`toast.dismiss(toastId?)\` | Dismiss a toast (or all) |
| \`toast.update(toastId, options)\` | Update an existing toast |
| \`toast.extended(options)\` | Extended toast with file list and summary |

## ToastOptions

| Prop | Type | Description |
|------|------|-------------|
| \`icon\` | \`ReactNode\` | Icon displayed on the left |
| \`type\` | \`"info" \\| "success" \\| "warning" \\| "error"\` | Toast variant |
| \`actions\` | \`ToastAction[]\` | Action buttons (See, Cancel, etc.) |
| \`progress\` | \`number\` | Progress percentage shown next to message |
| \`autoClose\` | \`number \\| false\` | Auto-dismiss delay in ms (default: 5000) |

## ToastAction

| Prop | Type | Description |
|------|------|-------------|
| \`label\` | \`string\` | Button text |
| \`onClick\` | \`() => void\` | Callback on click |

## Dismissing from an action

\`\`\`tsx
const id = toast.info("File moved", {
  actions: [
    { label: "Cancel", onClick: () => {
      undoMove();
      toast.dismiss(id);
    }},
  ],
});
\`\`\`

## Extended toast (file transfers)

Use \`toast.extended()\` to display a list of files with transfer status. The toast is **expanded by default**; the user can collapse/expand the list via the chevron (handled internally). Wire \`onClose\` to dismiss the toast.

\`\`\`tsx
import { toast } from "@gouvfr-lasuite/ui-kit";

const id = toast.extended({
  summary: "3 documents in transfer",
  progress: 15,
  items: [
    {
      id: "1",
      title: "Presentation on Monet",
      size: "12 GB",
      mimetype: "application/vnd.ms-powerpoint",
      status: "completed",
    },
    {
      id: "2",
      title: "Flower wallpaper – Uploading",
      mimetype: "image/jpeg",
      status: "loading",
    },
    {
      id: "3",
      title: "Seminar Logistics",
      size: "2 MB",
      mimetype: "application/pdf",
      status: "completed",
    },
  ],
  onClose: () => toast.dismiss(id),
  onInfoClick: () => showTransferDetails(),
  autoClose: false,
});
\`\`\`

To update progress as uploads complete, use \`toast.update()\` with a new \`ToastExtendedContent\` render (or re-call \`toast.extended\` after dismissing the previous one).

## ToastExtendedOptions

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \`items\` | \`ToastExtendedItem[]\` | Yes | List of files to display |
| \`summary\` | \`string\` | No | Footer text (e.g. "3 documents in transfer") |
| \`progress\` | \`number\` | No | Global progress % shown next to summary |
| \`onClose\` | \`() => void\` | No | Called when user clicks the X button |
| \`onInfoClick\` | \`() => void\` | No | Called when user clicks the info icon |
| \`autoClose\` | \`number \\| false\` | No | Auto-dismiss delay in ms (default: \`false\`) |
| \`containerId\` | \`string\` | No | Target a specific ToastContainer (e.g. Storybook) |

## ToastExtendedItem

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \`id\` | \`string\` | No | Unique key for the row |
| \`title\` | \`string\` | Yes | File name or label |
| \`size\` | \`string\` | No | File size (e.g. "12 GB", "2 MB") |
| \`mimetype\` | \`string\` | No | MIME type for automatic file icon |
| \`status\` | \`"completed" \\| "loading"\` | Yes | Shows checkmark or spinner |
| \`icon\` | \`ReactNode\` | No | Custom icon instead of mime-based FileIcon |
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 400, position: "relative" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {
  name: "Info with actions",
  render: () => {
    const containerId = "story-info-actions";
    return (
      <>
        <button
          className="c__button"
          onClick={() => {
            const id = toast.info("Document 1 moved to Document 2", {
              icon: <ArrowRight size={20} />,
              progress: 15,
              autoClose: false,
              containerId,
              actions: [
                { label: "See", onClick: () => alert("Navigate to document") },
                {
                  label: "Cancel",
                  onClick: () => toast.dismiss(id),
                },
              ],
            });
          }}
        >
          Show toast
        </button>
        <ToastProvider position="bottom-left" containerId={containerId} />
      </>
    );
  },
};

export const WithProgress: Story = {
  name: "With progress",
  render: () => {
    const containerId = "story-progress";
    return (
      <>
        <button
          className="c__button"
          onClick={() =>
            toast.info("Uploading document...", {
              icon: <ArrowRight size={20} />,
              progress: 45,
              autoClose: false,
              containerId,
            })
          }
        >
          Show progress toast
        </button>
        <ToastProvider position="bottom-left" containerId={containerId} />
      </>
    );
  },
};

export const Success: Story = {
  render: () => {
    const containerId = "story-success";
    return (
      <>
        <button
          className="c__button"
          onClick={() =>
            toast.success("Document successfully uploaded.", {
              icon: <span className="material-icons">check_circle</span>,
              containerId,
            })
          }
        >
          Show success toast
        </button>
        <ToastProvider position="bottom-left" containerId={containerId} />
      </>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const containerId = "story-warning";
    return (
      <>
        <button
          className="c__button"
          onClick={() =>
            toast.warning("Storage is almost full.", {
              icon: <span className="material-icons">warning</span>,
              containerId,
            })
          }
        >
          Show warning toast
        </button>
        <ToastProvider position="bottom-left" containerId={containerId} />
      </>
    );
  },
};

export const Error: Story = {
  render: () => {
    const containerId = "story-error";
    return (
      <>
        <button
          className="c__button"
          onClick={() =>
            toast.error("Upload failed. Please try again.", {
              icon: <span className="material-icons">error</span>,
              containerId,
            })
          }
        >
          Show error toast
        </button>
        <ToastProvider position="bottom-left" containerId={containerId} />
      </>
    );
  },
};

export const Stacked: Story = {
  name: "Multiple stacked",
  render: () => {
    const containerId = "story-stacked";
    let count = 0;
    return (
      <>
        <button
          className="c__button"
          onClick={() => {
            count++;
            toast.info(`Document ${count} moved to Folder`, {
              icon: <ArrowRight size={20} />,
              actions: [
                { label: "See", onClick: () => {} },
                { label: "Cancel", onClick: () => {} },
              ],
              progress: Math.round(Math.random() * 100),
              containerId,
            });
          }}
        >
          Add toast (click multiple times)
        </button>
        <ToastProvider position="bottom-left" containerId={containerId} />
      </>
    );
  },
};

export const Extended: Story = {
  name: "Extended",
  render: () => {
    const containerId = "story-extended";
    return (
      <>
        <button
          className="c__button"
          onClick={() => {
            const id = toast.extended({
              containerId,
              summary: "3 documents in transfer",
              progress: 15,
              items: [
                {
                  id: "1",
                  title: "Presentation on Monet",
                  size: "12 GB",
                  mimetype: "application/vnd.ms-powerpoint",
                  status: "completed",
                },
                {
                  id: "2",
                  title: "Flower wallpaper – Uploading",
                  mimetype: "image/jpeg",
                  status: "loading",
                },
                {
                  id: "3",
                  title: "Seminar Logistics",
                  size: "2 MB",
                  mimetype: "application/pdf",
                  status: "completed",
                },
                {
                  id: "4",
                  title: "Essay on the Vosges",
                  size: "10 MB",
                  mimetype: "application/pdf",
                  status: "completed",
                },
              ],
              onClose: () => toast.dismiss(id),
              onInfoClick: () => alert("More information"),
            });
          }}
        >
          Show extended toast
        </button>
        <ToastProvider position="bottom-left" containerId={containerId} />
      </>
    );
  },
};
