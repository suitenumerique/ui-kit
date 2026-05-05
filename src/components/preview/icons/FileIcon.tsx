import { FilePreviewType } from "../types";
import { getMimeCategory, ICONS } from "../utils/mimeTypes";
import { getExtensionFromName } from "../utils/getExtensionFromName";
import { IconSize } from ":/components/icon/types";

type FileIconProps = {
  file: Partial<FilePreviewType> & Pick<FilePreviewType, "mimetype" | "title">;
  size?: IconSize | number;
  type?: "mini" | "normal";
};

/**
 * Used by the FilePreview component to display the file icon.
 * Mirrors the variant in drive that operates on a FilePreviewType
 * rather than the drive-specific Item.
 */
export const FileIcon = ({
  file,
  size = IconSize.MEDIUM,
  type = "normal",
}: FileIconProps) => {
  const category = getMimeCategory(
    file.mimetype,
    getExtensionFromName(file.title),
  );
  const icon = ICONS[type][category];
  return <FileIconContent icon={icon} size={size} />;
};

export const FileIconContent = ({
  icon,
  size,
}: {
  icon: string;
  size: IconSize | number;
}) => {
  const sizeClassName = typeof size === "string" ? `icon--${size}` : undefined;
  return (
    <img
      src={icon}
      alt=""
      draggable="false"
      className={`c__file-icon ${sizeClassName}`}
      {...(typeof size === "number"
        ? { style: { width: `${size}px`, height: `${size}px` } }
        : {})}
    />
  );
};
