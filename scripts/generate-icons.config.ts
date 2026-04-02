export const config = {
  /** Directory where generated icon components will be written */
  outputDir: "src/components/icon/icons",

  /** Figma file key (from the URL: figma.com/design/<FILE_KEY>/...) */
  figmaFileKey: process.env.FIGMA_FILE_KEY ?? "hPwxE24MEaX3mBQ0KXNTSY",

  /** Figma node ID of the page or frame containing icons (e.g. "0:1") */
  figmaNodeId: process.env.FIGMA_NODE_ID ?? "10599-4122",

  /** Optional regex to filter component names (only matching names are exported) */
  nameFilter: undefined as RegExp | undefined,

  /** Delay in ms between Figma API image-export batches (to avoid 429s) */
  rateLimitDelayMs: 200,

  /** Maximum number of parallel SVG downloads */
  maxConcurrentDownloads: 5,

  /** Maximum number of retries on Figma API rate limit (429) */
  maxRetries: 5,

  /** Renames applied in the barrel file to avoid export conflicts with other components */
  exportRenames: {
    LeftPanel: "IconLeftPanel",
    RightPanel: "IconRightPanel",
  } as Record<string, string>,
};
