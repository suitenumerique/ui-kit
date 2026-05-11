import type { Meta, StoryObj } from "@storybook/react";
import {
  Title,
  Description,
  Controls,
  Primary,
  Stories,
} from "@storybook/blocks";
import { FilePreview } from "../FilePreview";
import { FilePreviewExample } from "./FilePreviewExample";
import {
  allFiles,
  audioFiles,
  heicFile,
  imageFiles,
  pdfFiles,
  suspiciousFile,
  unsupportedFiles,
  videoFiles,
  wopiFile,
} from "./fixtures";
import { Button } from "@gouvfr-lasuite/cunningham-react";

/**
 * The `FilePreview` component is a fullscreen modal viewer that renders a list
 * of files with a built-in viewer per MIME category. It handles navigation
 * between files (arrow buttons + keyboard), keeps the document title in sync
 * with the open file, and exposes hooks for downloading, opening in an
 * external editor, and rendering custom sidebar / header content.
 *
 * Supported viewers, picked automatically from `mimetype`:
 *
 * | Category | Viewer | Highlights |
 * |----------|--------|------------|
 * | Image    | `ImageViewer`   | Zoom (wheel, pinch, keyboard), pan, reset, fit-to-viewport |
 * | Video    | `VideoPlayer`   | Custom controls, ±10s skip, volume + mute, fullscreen |
 * | Audio    | `AudioPlayer`   | Title, seekable bar, ±10s skip, volume + mute |
 * | PDF      | `PdfPreview`    | Virtualized pages, zoom, page input, thumbnail sidebar (lazy-loaded) |
 * | HEIC     | `NotSupportedPreview` | Fallback with download CTA (no native browser support) |
 * | Unknown  | `NotSupportedPreview` | Fallback with download CTA |
 * | Flagged  | `SuspiciousPreview`   | Warning screen when `isSuspicious: true` |
 * | WOPI     | `WopiOpenInEditor`    | "Open in editor" CTA when `is_wopi_supported: true` and `onOpenInEditor` is provided |
 *
 * ## Installation
 *
 * ```tsx
 * import { FilePreview, FilePreviewType } from "@gouvfr-lasuite/ui-kit";
 * ```
 *
 * The PDF viewer relies on optional peer dependencies (`react-pdf`,
 * `pdfjs-dist`, `react-virtualized`). They are loaded lazily — non-PDF
 * previews work without them. Wrap your app in a `QueryClientProvider`
 * (TanStack Query) to enable PDF caching.
 *
 * ## Basic usage
 *
 * ```tsx
 * import { useState } from "react";
 * import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 * import { FilePreview, FilePreviewType } from "@gouvfr-lasuite/ui-kit";
 *
 * const queryClient = new QueryClient();
 *
 * const files: FilePreviewType[] = [
 *   {
 *     id: "1",
 *     title: "monet.jpeg",
 *     mimetype: "image/jpeg",
 *     size: 245_000,
 *     url: "/files/monet.jpeg",
 *     url_preview: "/files/monet.jpeg",
 *   },
 *   {
 *     id: "2",
 *     title: "report.pdf",
 *     mimetype: "application/pdf",
 *     size: 1_200_000,
 *     url: "/files/report.pdf",
 *     url_preview: "/files/report.pdf",
 *   },
 * ];
 *
 * export const MyGallery = () => {
 *   const [openedFileId, setOpenedFileId] = useState<string | undefined>();
 *
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <button onClick={() => setOpenedFileId("1")}>Open</button>
 *
 *       <FilePreview
 *         isOpen={!!openedFileId}
 *         openedFileId={openedFileId}
 *         files={files}
 *         onClose={() => setOpenedFileId(undefined)}
 *         onChangeFile={(file) => setOpenedFileId(file?.id)}
 *         handleDownloadFile={(file) => window.open(file?.url, "_blank")}
 *       />
 *     </QueryClientProvider>
 *   );
 * };
 * ```
 *
 * ## `FilePreviewType`
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `id` | `string` | Stable identifier — used for `openedFileId` and React keys |
 * | `title` | `string` | Filename shown in the header (extension is stripped) |
 * | `mimetype` | `string` | Drives viewer selection (e.g. `image/jpeg`, `application/pdf`) |
 * | `size` | `number` | File size in bytes |
 * | `url` | `string` | Canonical URL of the file (used for download) |
 * | `url_preview` | `string` | URL passed to the viewer — can be a signed/short-lived variant |
 * | `is_wopi_supported` | `boolean?` | Show the "Open in editor" CTA instead of an inline viewer |
 * | `isSuspicious` | `boolean?` | Show the suspicious-file warning screen |
 *
 * ## `FilePreviewProps`
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `isOpen` | `boolean` | Controls the modal visibility |
 * | `files` | `FilePreviewType[]` | Collection navigated via prev/next |
 * | `openedFileId` | `string?` | Currently opened file id — drives the viewer |
 * | `initialIndexFile` | `number?` | Fallback index when `openedFileId` isn't provided (default `-1`) |
 * | `title` | `string?` | Header title used when no file is selected (default `"File Preview"`) |
 * | `onClose` | `() => void` | Called when the user dismisses the modal |
 * | `onChangeFile` | `(file?: FilePreviewType) => void` | Fires on prev/next — sync your `openedFileId` here |
 * | `onFileOpen` | `(file: FilePreviewType) => void` | Fires once per file when it becomes visible |
 * | `handleDownloadFile` | `(file?: FilePreviewType) => void` | Enables the download button + menu entry |
 * | `onOpenInEditor` | `(file: FilePreviewType) => void` | Required to render the WOPI "Open in editor" CTA |
 * | `customHeaderActions` | `(headerActions: ReactNode) => ReactNode` | Wraps the built-in header actions — receives them as a node so you can add nodes around them or replace the group entirely |
 * | `headerActionsMenuOptions` | `(file: FilePreviewType) => MenuItemAction[]` | Extends the kebab (`more_horiz`) menu with extra entries — appended after Download / Print on PDF and image files |
 * | `sidebarContent` | `ReactNode` | Content of the right-side info panel (toggled with the `info` button) |
 * | `hideCloseButton` | `boolean?` | Remove the top-left close button |
 * | `pdfWorkerSrc` | `string?` | Override the `pdf.worker.mjs` URL passed to `pdfjs-dist` |
 *
 * ## Keyboard shortcuts
 *
 * - `←` / `→` — previous / next file
 * - PDF viewer: standard zoom and page-input shortcuts (see the **Pdf** story)
 *
 * ## Notes
 *
 * - `openedFileId` is the source of truth: pair it with `onChangeFile` to keep
 *   your state in sync when the user uses prev/next.
 * - `url_preview` is intentionally separate from `url` so you can serve a
 *   short-lived signed URL to the viewer while keeping the canonical URL for
 *   downloads.
 * - PDF rendering is code-split. The first PDF open triggers the chunk
 *   download; subsequent opens are instant.
 */
const meta: Meta<typeof FilePreview> = {
  title: "Components/Preview/FilePreview",
  component: FilePreview,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
      // The canonical code sample lives in the meta description above —
      // per-story "Show code" would only echo `<FilePreviewExample files={...} />`,
      // so the toggle is hidden across all stories.
      canvas: { sourceState: "none" },
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
  argTypes: {
    isOpen: {
      description: "Controls the modal visibility",
      control: "boolean",
    },
    files: {
      description: "Collection navigated via prev/next",
      control: false,
    },
    openedFileId: {
      description: "Currently opened file id — drives the viewer",
      control: "text",
    },
    initialIndexFile: {
      description: "Fallback index when `openedFileId` isn't provided",
      control: "number",
    },
    title: {
      description: "Header title used when no file is selected",
      control: "text",
    },
    onClose: {
      description: "Called when the user dismisses the modal",
      control: false,
    },
    onChangeFile: {
      description: "Fires on prev/next — sync your `openedFileId` here",
      control: false,
    },
    onFileOpen: {
      description: "Fires once per file when it becomes visible",
      control: false,
    },
    handleDownloadFile: {
      description: "Enables the download button + menu entry",
      control: false,
    },
    onOpenInEditor: {
      description: 'Required to render the WOPI "Open in editor" CTA',
      control: false,
    },
    customHeaderActions: {
      description:
        "Wraps the built-in header actions — receives them as a node so you can add content around or replace them",
      control: false,
    },
    headerActionsMenuOptions: {
      description:
        "Extends the kebab actions menu with extra entries (PDF and image files only)",
      control: false,
    },
    sidebarContent: {
      description: "Content of the right-side info panel",
      control: false,
    },
    hideCloseButton: {
      description: "Remove the top-left close button",
      control: "boolean",
    },
    pdfWorkerSrc: {
      description: "Override the `pdf.worker.mjs` URL passed to `pdfjs-dist`",
      control: "text",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FilePreview>;

/**
 * Displays images with zoom controls (mouse wheel, pinch-to-zoom, keyboard
 * shortcuts), pan/drag when zoomed in beyond the viewport, and a reset
 * button. Images are automatically scaled to fit the available space on load.
 */
export const Image: Story = {
  render: () => <FilePreviewExample files={imageFiles} />,
};

/**
 * Plays video files with custom controls: play/pause, 10-second rewind/forward,
 * seekable duration bar, volume slider with mute toggle, and fullscreen support.
 * A transient play/pause status icon is shown on click.
 */
export const Video: Story = {
  render: () => <FilePreviewExample files={videoFiles} />,
};

/**
 * Audio player with a title display, seekable duration bar, play/pause,
 * 10-second skip forward/backward, and volume controls with mute toggle.
 */
export const Audio: Story = {
  render: () => <FilePreviewExample files={audioFiles} />,
};

/**
 * PDF viewer with virtualized page rendering:
 * - Zoom controls
 * - Page navigation (input field + keyboard)
 * - Collapsible thumbnail sidebar
 * - Virtualized scroll, supporting large documents
 *
 * ## Why this PDF viewer instead of the browser's built-in one
 *
 * Browsers ship a native PDF viewer, but it lacks the safety nets we need
 * for user-uploaded documents:
 *
 * - **External-link disclaimer.** Built-in viewers follow embedded links
 *   silently — a malicious PDF can drop users on an attacker-controlled
 *   page in a single click. Our viewer intercepts anchor activations and
 *   shows a confirmation dialog with the destination URL before opening
 *   it (`http(s)` only, in a new tab with `noopener,noreferrer`).
 * - **No JavaScript evaluation.** The PDF spec allows scripted actions
 *   (forms, annotations, `openAction`). Browsers' built-in viewers still
 *   honour parts of that surface. We pass `isEvalSupported: false` to
 *   `pdfjs-dist`, which disables the eval-based codepath used to run
 *   embedded scripts.
 * - **Large documents stay responsive.** Native viewers tend to render
 *   pages eagerly and choke on hundred-page or oversized files. Ours uses
 *   `react-virtualized` to render only the pages in the viewport, with a
 *   lazy thumbnail sidebar — large PDFs scroll smoothly instead of
 *   freezing the tab.
 *
 * `pdfWorkerSrc` defaults to `/pdf.worker.mjs`. Override it if you serve
 * the worker from a different path (CDN, sub-path deployment).
 */
export const Pdf: Story = {
  render: () => <FilePreviewExample files={pdfFiles} />,
};

/**
 * HEIC images are not natively supported by most browsers. This story shows the
 * fallback "not supported" message with the file icon and a download button.
 */
export const HeicUnsupported: Story = {
  render: () => <FilePreviewExample files={[heicFile]} />,
};

/**
 * Files whose MIME type does not match any built-in viewer (e.g. `.iso`, `.7z`,
 * `.pages`) display a message explaining the format is unsupported, along with
 * the file icon and a download button.
 */
export const NotSupported: Story = {
  render: () => <FilePreviewExample files={unsupportedFiles} />,
};

/**
 * When a file is flagged as suspicious (`isSuspicious: true`), a warning screen
 * is shown with a dedicated icon and a cautionary download button styled with a
 * warning color. The flag wins over the regular viewer for the file's MIME type.
 */
export const Suspicious: Story = {
  render: () => <FilePreviewExample files={[suspiciousFile]} />,
};

/**
 * Files that support WOPI editing (e.g. Office documents with
 * `is_wopi_supported: true`) display the file icon, a description, and an
 * "Open in editor" button that triggers the `onOpenInEditor` callback.
 *
 * The button only renders when **both** the file flag and the
 * `onOpenInEditor` prop are provided.
 */
export const WopiOpenInEditor: Story = {
  render: () => <FilePreviewExample files={[wopiFile]} />,
};

/**
 * Two hooks let consumers extend the header without forking the component:
 *
 * - `customHeaderActions(headerActions)` — receives the built-in action group
 *   as a `ReactNode` and returns whatever you want rendered in its place.
 *   Use it to add content around the built-in buttons (e.g. a status pill,
 *   a trailing "Share" button) or to replace the group entirely.
 * - `headerActionsMenuOptions(file)` — returns extra `MenuItemAction[]`
 *   appended to the kebab (`more_horiz`) menu. Only rendered for PDF and image
 *   files, where the actions menu is shown.
 *
 * Both are evaluated per file, so you can show different actions for
 * different files.
 */
export const CustomHeaderActions: Story = {
  render: () => (
    <FilePreviewExample
      files={imageFiles}
      customHeaderActions={(headerActions) => (
        <>
          <Button variant="tertiary">Custom button</Button>
          {headerActions}
          <Button variant="secondary">Custom button too</Button>
        </>
      )}
      headerActionsMenuOptions={(file) => [
        {
          id: "copy-link",
          label: "Copy link",
          callback: () => console.log("[storybook] copy link", file.id),
        },
        {
          id: "delete",
          label: "Delete",
          variant: "danger",
          callback: () => console.log("[storybook] delete", file.id),
        },
      ]}
    />
  ),
};

/**
 * Combines all file types into a single collection to demonstrate the
 * prev/next navigation (arrow buttons and `←` / `→` keys) across every viewer
 * type. Use `onChangeFile` to keep your `openedFileId` state in sync.
 */
export const AllFiles: Story = {
  render: () => <FilePreviewExample files={allFiles} />,
};
