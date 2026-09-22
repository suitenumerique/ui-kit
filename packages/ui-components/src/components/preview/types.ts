export type FilePreviewType = {
  id: string;
  size: number;
  title: string;
  mimetype: string;
  is_wopi_supported?: boolean;
  url_preview: string;
  url: string;
  isSuspicious?: boolean;
  /**
   * The user cannot open this folder. Defaults to false.
   * Do not set this for a restricted folder the user can still access.
   */
  isFolderAccessDenied?: boolean;
};
