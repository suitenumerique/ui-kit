import { Fragment } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileIcon } from "../icons/FileIcon";
import { MimeCategory } from "../utils/mimeTypes";
import type { FilePreviewType } from "../types";
import { IconSize } from ":/components/icon";

/**
 * `FileIcon` renders a file-type icon resolved from `mimetype` (with the
 * `title` extension as fallback for ambiguous cases — e.g. `.numbers` or
 * `.grist` files whose MIME is generic).
 *
 * - `file`: only `mimetype` and `title` are required — `title` may be `""`
 *   when there's no extension hint (the rest of `FilePreviewType` is accepted
 *   but ignored).
 * - `type`: `"mini"` (compact, used in the `FilePreview` header and lists) or
 *   `"normal"` (full, used in empty/unsupported screens). Default: `"normal"`.
 * - `size`: an `IconSize`, **or** any
 *   `number` rendered as inline `width`/`height` in pixels for arbitrary
 *   on-demand sizing. Default: `IconSize.MEDIUM`.
 *
 * ## Usage
 *
 * ```tsx
 * import { FileIcon } from "@gouvfr-lasuite/ui-kit";
 *
 * // Minimum input — only mimetype and title are required.
 * <FileIcon file={{ mimetype: "application/pdf", title: "report.pdf" }} />
 * <FileIcon file={{ mimetype: "image/jpeg", title: "" }} size="xlarge" />
 *
 * // A full FilePreviewType is also accepted (extra fields are ignored).
 * <FileIcon file={file} type="mini" size="small" />
 *
 * // Any number is rendered as inline width/height in pixels.
 * <FileIcon file={file} size={48} />
 * ```
 *
 * Resolution falls back to the title extension when MIME is generic:
 *
 * ```tsx
 * // .numbers files often arrive as application/octet-stream — extension wins.
 * <FileIcon file={{ title: "budget.numbers", mimetype: "application/octet-stream" }} />
 *
 * // .grist requires both: mimetype "application/vnd.sqlite3" + .grist extension.
 * <FileIcon file={{ title: "data.grist", mimetype: "application/vnd.sqlite3" }} />
 * ```
 *
 */
const meta: Meta<typeof FileIcon> = {
  title: "Components/Preview/FileIcon",
  component: FileIcon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      // Per-story "Show code" would only echo the wrapper grid — the
      // canonical examples live in the meta description above.
      canvas: { sourceState: "none" },
    },
  },
  argTypes: {
    file: {
      description:
        'Only `mimetype` and `title` are required (`title` may be `""`); other `FilePreviewType` fields are ignored',
      control: false,
    },
    type: {
      description: "Visual variant — compact `mini` or full `normal`",
      control: { type: "inline-radio" },
      options: ["mini", "normal"],
    },
    size: {
      description:
        "An `IconSize` keyword (rendered as a class) or any `number` (rendered as inline px width/height)",
      control: { type: "inline-radio" },
      options: [
        IconSize.X_SMALL,
        IconSize.SMALL,
        IconSize.MEDIUM,
        IconSize.LARGE,
        IconSize.X_LARGE,
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileIcon>;

const fixture = (
  id: string,
  title: string,
  mimetype: string,
): FilePreviewType => ({
  id,
  title,
  mimetype,
  size: 0,
  url: "",
  url_preview: "",
});

const SAMPLES: Array<{ category: MimeCategory; file: FilePreviewType }> = [
  {
    category: MimeCategory.PDF,
    file: fixture("pdf", "report.pdf", "application/pdf"),
  },
  {
    category: MimeCategory.DOC,
    file: fixture(
      "doc",
      "letter.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ),
  },
  {
    category: MimeCategory.CALC,
    file: fixture(
      "calc",
      "budget.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ),
  },
  {
    category: MimeCategory.POWERPOINT,
    file: fixture(
      "ppt",
      "deck.pptx",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ),
  },
  {
    category: MimeCategory.IMAGE,
    file: fixture("img", "photo.jpg", "image/jpeg"),
  },
  {
    category: MimeCategory.AUDIO,
    file: fixture("aud", "song.mp3", "audio/mpeg"),
  },
  {
    category: MimeCategory.VIDEO,
    file: fixture("vid", "clip.mp4", "video/mp4"),
  },
  {
    category: MimeCategory.ARCHIVE,
    file: fixture("zip", "files.zip", "application/zip"),
  },
  {
    category: MimeCategory.SQLITE,
    file: fixture("sql", "data.db", "application/x-sqlite3"),
  },
  // GRIST resolves only when both mimetype matches AND extension is "grist".
  {
    category: MimeCategory.GRIST,
    file: fixture("grist", "data.grist", "application/vnd.sqlite3"),
  },
  {
    category: MimeCategory.OTHER,
    file: fixture("other", "thing.xyz", "text/plain"),
  },
];

const SIZES = [
  IconSize.X_SMALL,
  IconSize.SMALL,
  IconSize.MEDIUM,
  IconSize.LARGE,
  IconSize.X_LARGE,
] as const;
const TYPES = ["mini", "normal"] as const;

const cellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 56,
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  fontSize: 12,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const rowLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontSize: 13,
  color: "#374151",
  fontFamily: "ui-monospace, SFMono-Regular, monospace",
};

/**
 * Every category × every `type` × every `size`. Rows are categories;
 * columns group both types across all four sizes.
 */
export const AllCombinations: Story = {
  render: () => (
    <div className="file-icon-story" style={{ padding: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `140px repeat(${
            TYPES.length * SIZES.length
          }, 1fr)`,
          gap: 8,
          alignItems: "center",
        }}
      >
        <div />
        {TYPES.map((type) => (
          <div
            key={`group-${type}`}
            style={{
              gridColumn: `span ${SIZES.length}`,
              ...headerStyle,
              fontWeight: 600,
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: 4,
            }}
          >
            type=&quot;{type}&quot;
          </div>
        ))}

        <div />
        {TYPES.flatMap((type) =>
          SIZES.map((size) => (
            <div key={`hdr-${type}-${size}`} style={headerStyle}>
              {size}
            </div>
          )),
        )}

        {SAMPLES.map(({ category, file }) => (
          <Fragment key={category}>
            <div style={rowLabelStyle}>{category}</div>
            {TYPES.flatMap((type) =>
              SIZES.map((size) => (
                <div key={`${category}-${type}-${size}`} style={cellStyle}>
                  <FileIcon file={file} type={type} size={size} />
                </div>
              )),
            )}
          </Fragment>
        ))}
      </div>
    </div>
  ),
};

const CUSTOM_SIZES = [12, 20, 28, 48, 72, 96, 128] as const;

/**
 * `size` also accepts any `number` and applies it as inline `width`/`height`
 * in pixels — useful when none of the `IconSize` keywords fit the surface
 * you're rendering into.
 */
export const CustomSize: Story = {
  render: () => (
    <div className="file-icon-story" style={{ padding: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `140px repeat(${CUSTOM_SIZES.length}, 1fr)`,
          gap: 8,
          alignItems: "center",
        }}
      >
        <div />
        {CUSTOM_SIZES.map((size) => (
          <div key={`hdr-${size}`} style={headerStyle}>
            {size}px
          </div>
        ))}

        {TYPES.map((type) => (
          <Fragment key={`row-${type}`}>
            <div style={rowLabelStyle}>type=&quot;{type}&quot;</div>
            {CUSTOM_SIZES.map((size) => (
              <div key={`${type}-${size}`} style={cellStyle}>
                <FileIcon file={SAMPLES[0].file} type={type} size={size} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  ),
};

/** Single icon — use the controls panel to switch `type`, `size` and category. */
export const Playground: Story = {
  args: {
    file: SAMPLES[0].file,
    type: "normal",
    size: IconSize.MEDIUM,
  },
  decorators: [
    (Story) => (
      <div className="file-icon-story" style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};
