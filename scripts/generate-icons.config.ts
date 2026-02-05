export const config = {
  /** Directory where generated icon components will be written */
  outputDir: "src/components/icon/icons",

  /** Figma file key (from the URL: figma.com/design/<FILE_KEY>/...) */
  figmaFileKey: "YOUR_FIGMA_FILE_KEY",

  /** Figma node ID of the page or frame containing icons (e.g. "0:1") */
  figmaNodeId: "YOUR_FIGMA_NODE_ID",

  /** Optional regex to filter component names (only matching names are exported) */
  nameFilter: undefined as RegExp | undefined,

  /** Delay in ms between Figma API image-export batches (to avoid 429s) */
  rateLimitDelayMs: 200,

  /** Maximum number of parallel SVG downloads */
  maxConcurrentDownloads: 5,
};
