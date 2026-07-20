export type UploadFileStatus = "pending" | "uploading" | "done" | "error";

export type UploadFile = {
  /** Stable identifier. */
  id: string;
  /** Native file selected by the user, including its binary contents. */
  originalFile: File;
  /** Current status (default: "done"). */
  status?: UploadFileStatus;
  /** Upload progress percentage, from 0 to 100, used when status is "uploading". */
  progress?: number;
  /** Short error message shown inline when status is "error". */
  error?: string;
  /** Optional detailed error message shown when hovering or focusing the error icon. */
  errorDetails?: string;
};

export type UploadFileLabels = Partial<{
  noFileYet: string;
  clickToUpload: string;
  dragAndDrop: string;
  addFile: string;
  uploading: string;
  cancel: string;
  remove: string;
  genericError: string;
  /** When set, overrides the computed "Max …" hint. */
  maxSize: string;
}>;

export type ResolvedUploadLabels = {
  noFileYet: string;
  clickToUpload: string;
  dragAndDrop: string;
  addFile: string;
  uploading: string;
  cancel: string;
  remove: string;
  genericError: string;
  maxSize?: string;
};
