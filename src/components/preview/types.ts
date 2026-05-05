export type FilePreviewType = {
  id: string;
  size: number;
  title: string;
  mimetype: string;
  is_wopi_supported?: boolean;
  url_preview: string;
  url: string;
  isSuspicious?: boolean;
};
