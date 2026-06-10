export type UploadFileStatus = "pending" | "uploading" | "done" | "error";

export type UploadFile = {
  /** Stable identifier. */
  id: string;
  /** File name displayed to the user. */
  name: string;
  /** Size in bytes. */
  size?: number;
  /** Current status (default: "done"). */
  status?: UploadFileStatus;
  /** Upload progress percentage, from 0 to 100, used when status is "uploading". */
  progress?: number;
  /** Error message shown when status is "error". */
  error?: string;
  /** Mimetype, used to pick the file icon. */
  type?: string;
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
