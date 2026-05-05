import mimeCalc from ":/assets/files/icons/mime-calc.svg";
import mimeDoc from ":/assets/files/icons/mime-doc.svg";
import mimeImage from ":/assets/files/icons/mime-image.svg";
import mimeOther from ":/assets/files/icons/mime-other.svg";
import mimePdf from ":/assets/files/icons/mime-pdf.svg";
import mimePowerpoint from ":/assets/files/icons/mime-powerpoint.svg";
import mimeAudio from ":/assets/files/icons/mime-audio.svg";
import mimeVideo from ":/assets/files/icons/mime-video.svg";
import mimeSQLite from ":/assets/files/icons/mime-sqlite.svg";
import mimeGrist from ":/assets/files/icons/mime-grist.svg";

import mimeCalcMini from ":/assets/files/icons/mime-calc-mini.svg";
import mimeDocMini from ":/assets/files/icons/mime-doc-mini.svg";
import mimeImageMini from ":/assets/files/icons/mime-image-mini.svg";
import mimePdfMini from ":/assets/files/icons/mime-pdf-mini.svg";
import mimePowerpointMini from ":/assets/files/icons/mime-powerpoint-mini.svg";
import mimeAudioMini from ":/assets/files/icons/mime-audio-mini.svg";
import mimeVideoMini from ":/assets/files/icons/mime-video-mini.svg";
import mimeArchiveMini from ":/assets/files/icons/mime-archive-mini.svg";
import mimeSuspicious from ":/assets/files/icons/suspicious_file.svg";
import mimeSQLiteMini from ":/assets/files/icons/mime-sqlite-mini.svg";
import mimeGristMini from ":/assets/files/icons/mime-grist-mini.svg";

import mimeArchive from ":/assets/files/icons/mime-archive.svg";
import { getExtensionFromName } from "./getExtensionFromName";

export enum MimeCategory {
  CALC = "calc",
  DOC = "doc",
  IMAGE = "image",
  OTHER = "other",
  PDF = "pdf",
  POWERPOINT = "powerpoint",
  AUDIO = "audio",
  VIDEO = "video",
  ARCHIVE = "archive",
  SUSPICIOUS = "suspicious",
  SQLITE = "sqlite",
  GRIST = "grist",
}

export const ICONS = {
  mini: {
    [MimeCategory.CALC]: mimeCalcMini,
    [MimeCategory.DOC]: mimeDocMini,
    [MimeCategory.IMAGE]: mimeImageMini,
    [MimeCategory.OTHER]: mimeOther,
    [MimeCategory.PDF]: mimePdfMini,
    [MimeCategory.POWERPOINT]: mimePowerpointMini,
    [MimeCategory.AUDIO]: mimeAudioMini,
    [MimeCategory.VIDEO]: mimeVideoMini,
    [MimeCategory.ARCHIVE]: mimeArchiveMini,
    [MimeCategory.SUSPICIOUS]: mimeSuspicious,
    [MimeCategory.SQLITE]: mimeSQLiteMini,
    [MimeCategory.GRIST]: mimeGristMini,
  },
  normal: {
    [MimeCategory.CALC]: mimeCalc,
    [MimeCategory.DOC]: mimeDoc,
    [MimeCategory.IMAGE]: mimeImage,
    [MimeCategory.OTHER]: mimeOther,
    [MimeCategory.PDF]: mimePdf,
    [MimeCategory.POWERPOINT]: mimePowerpoint,
    [MimeCategory.AUDIO]: mimeAudio,
    [MimeCategory.VIDEO]: mimeVideo,
    [MimeCategory.ARCHIVE]: mimeArchive,
    [MimeCategory.SUSPICIOUS]: mimeSuspicious,
    [MimeCategory.SQLITE]: mimeSQLite,
    [MimeCategory.GRIST]: mimeGrist,
  },
};

export const MIME_MAP = {
  [MimeCategory.CALC]: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.spreadsheet",
    "text/csv",
  ],
  [MimeCategory.PDF]: ["application/pdf"],
  [MimeCategory.DOC]: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
  ],
  [MimeCategory.POWERPOINT]: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.oasis.opendocument.presentation",
  ],
  [MimeCategory.ARCHIVE]: [
    "application/zip",
    "application/x-7z-compressed",
    "application/x-rar-compressed",
    "application/x-tar",
    "application/x-rar",
    "application/octet-stream",
  ],
  [MimeCategory.SQLITE]: [
    "application/x-sqlite3",
    "application/vnd.sqlite3",
  ],
};

export const MIME_TO_CATEGORY: Record<string, MimeCategory> = {};
Object.entries(MIME_MAP).forEach(([category, mimes]) => {
  mimes.forEach((mime) => {
    MIME_TO_CATEGORY[mime] = category as MimeCategory;
  });
});

export const CALC_EXTENSIONS = ["numbers", "xlsx", "xls"];

export const KNOWN_EXTENSIONS = new Set([
  "doc", "docx", "docm", "odt", "rtf", "txt", "pdf",
  "xls", "xlsx", "xlsm", "ods", "csv", "numbers",
  "ppt", "pptx", "pptm", "odp",
  "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico",
  "tiff", "tif", "heic", "heif",
  "mp3", "wav", "flac", "aac", "ogg", "oga", "wma", "m4a",
  "mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "m4v", "3gp",
  "zip", "rar", "7z", "tar", "gz", "bz2", "xz",
  "db", "sqlite", "sqlite3", "grist",
  "html", "htm", "xml", "json", "js", "ts", "css", "scss",
  "py", "java", "cpp", "c", "h", "php", "rb", "go", "rs",
  "md", "yaml", "yml",
]);

export const getMimeCategory = (
  mimetype: string,
  extension?: string | null
): MimeCategory => {
  // Some calc files have a archive mime type, but are actually calc files.
  if (extension && CALC_EXTENSIONS.includes(extension)) {
    return MimeCategory.CALC;
  }

  if (mimetype === "application/vnd.sqlite3" && extension === "grist") {
    return MimeCategory.GRIST;
  }

  if (MIME_TO_CATEGORY[mimetype]) {
    return MIME_TO_CATEGORY[mimetype];
  }
  if (mimetype?.startsWith("image/")) {
    return MimeCategory.IMAGE;
  }
  if (mimetype?.startsWith("audio/")) {
    return MimeCategory.AUDIO;
  }
  if (mimetype?.startsWith("video/")) {
    return MimeCategory.VIDEO;
  }

  return MimeCategory.OTHER;
};

const isValidExtension = (extension: string): boolean => {
  if (!extension || extension.length === 0) {
    return false;
  }
  return KNOWN_EXTENSIONS.has(extension.toLowerCase());
};

/**
 * Removes the file extension from a filename.
 * Only removes extensions present in KNOWN_EXTENSIONS.
 */
export const removeFileExtension = (filename: string): string => {
  if (!filename) {
    return filename;
  }

  if (filename.startsWith(".")) {
    return filename;
  }

  const extension = getExtensionFromName(filename);
  if (!extension) {
    return filename;
  }

  if (!isValidExtension(extension)) {
    return filename;
  }

  const extensionLength = extension.length + 1;
  return filename.slice(0, -extensionLength);
};
