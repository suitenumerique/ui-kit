import { transform } from "@svgr/core";
import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "./generate-icons.config.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FigmaComponent {
  id: string;
  name: string;
  type: string;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { token: string; fileKey: string; nodeId: string } {
  const args = process.argv.slice(2);
  const map = new Map<string, string>();

  for (const arg of args) {
    const match = arg.match(/^--([a-z-]+)=(.+)$/);
    if (match) {
      map.set(match[1], match[2]);
    }
  }

  const token = map.get("token");
  if (!token) {
    console.error("Error: --token=<FIGMA_TOKEN> is required");
    process.exit(1);
  }

  const fileKey = map.get("file-key") ?? config.figmaFileKey;
  const nodeId = map.get("node-id") ?? config.figmaNodeId;

  if (fileKey === "YOUR_FIGMA_FILE_KEY" || nodeId === "YOUR_FIGMA_NODE_ID") {
    console.error(
      "Error: Figma file key and node ID must be provided via --file-key/--node-id flags or in generate-icons.config.ts",
    );
    process.exit(1);
  }

  return { token, fileKey, nodeId };
}

// ---------------------------------------------------------------------------
// Figma API helpers
// ---------------------------------------------------------------------------

async function figmaFetch(
  endpoint: string,
  token: string,
): Promise<unknown> {
  const url = `https://api.figma.com${endpoint}`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("retry-after") ?? "30");
    console.warn(`Rate limited – retrying after ${retryAfter}s …`);
    await sleep(retryAfter * 1000);
    return figmaFetch(endpoint, token);
  }

  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${res.statusText} – ${url}`);
  }

  return res.json();
}

function collectComponents(node: FigmaNode): FigmaComponent[] {
  const components: FigmaComponent[] = [];

  if (node.type === "COMPONENT") {
    components.push({ id: node.id, name: node.name, type: node.type });
  }

  if (node.children) {
    for (const child of node.children) {
      components.push(...collectComponents(child));
    }
  }

  return components;
}

// ---------------------------------------------------------------------------
// Naming utilities
// ---------------------------------------------------------------------------

function toPascalCase(name: string): string {
  return name
    .replace(/[/\\_.,-]+/g, " ") // separators → space
    .replace(/[^a-zA-Z0-9 ]/g, "") // strip special chars
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

function safeComponentName(raw: string): string {
  let name = toPascalCase(raw);

  // Prefix with "Icon" if it starts with a digit
  if (/^\d/.test(name)) {
    name = `Icon${name}`;
  }

  // Fallback for empty names
  if (!name) {
    name = "Icon";
  }

  return name;
}

function deduplicateNames(
  components: { id: string; name: string }[],
): Map<string, string> {
  const nameToId = new Map<string, string>();
  const idToName = new Map<string, string>();
  const counts = new Map<string, number>();

  for (const comp of components) {
    const base = safeComponentName(comp.name);
    const count = (counts.get(base) ?? 0) + 1;
    counts.set(base, count);

    const finalName = count > 1 ? `${base}${count}` : base;
    nameToId.set(finalName, comp.id);
    idToName.set(comp.id, finalName);
  }

  return idToName;
}

// ---------------------------------------------------------------------------
// SVG download with concurrency limit
// ---------------------------------------------------------------------------

async function downloadWithConcurrency(
  urls: Map<string, string>,
  maxConcurrent: number,
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const entries = Array.from(urls.entries());
  let index = 0;

  async function worker() {
    while (index < entries.length) {
      const i = index++;
      const [nodeId, url] = entries[i];

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`  ⚠ Failed to download SVG for ${nodeId}: ${res.status}`);
          continue;
        }
        const text = await res.text();

        if (!text.includes("<svg")) {
          console.warn(`  ⚠ Invalid SVG content for ${nodeId}, skipping`);
          continue;
        }

        results.set(nodeId, text);
      } catch (err) {
        console.warn(`  ⚠ Error downloading ${nodeId}: ${err}`);
      }
    }
  }

  const workers = Array.from({ length: maxConcurrent }, () => worker());
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// SVGR transformation
// ---------------------------------------------------------------------------

async function svgToComponent(
  svgContent: string,
  componentName: string,
): Promise<string> {
  const code = await transform(
    svgContent,
    {
      plugins: [
        "@svgr/plugin-svgo",
        "@svgr/plugin-jsx",
        "@svgr/plugin-prettier",
      ],
      typescript: true,
      exportType: "named",
      namedExport: componentName,
      jsxRuntime: "automatic",
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          { name: "removeDimensions" },
          {
            name: "convertColors",
            params: { currentColor: true },
          },
        ],
      },
      svgProps: {
        width: "{24}",
        height: "{24}",
      },
    },
    { componentName },
  );

  const header = "// Auto-generated by scripts/generate-icons.ts -- DO NOT EDIT\n";
  return header + code;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

async function main() {
  const { token, fileKey, nodeId } = parseArgs();
  let errorCount = 0;

  // 1. Fetch the Figma node tree
  console.log(`Fetching Figma node tree for file=${fileKey} node=${nodeId} …`);
  const nodesResponse = (await figmaFetch(
    `/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`,
    token,
  )) as { nodes: Record<string, { document: FigmaNode }> };

  const rootNode = Object.values(nodesResponse.nodes)[0]?.document;
  if (!rootNode) {
    console.error("Error: Could not find the specified node in the Figma file");
    process.exit(1);
  }

  // 2. Collect all COMPONENT nodes
  let components = collectComponents(rootNode);
  console.log(`Found ${components.length} component(s) in Figma`);

  if (config.nameFilter) {
    components = components.filter((c) => config.nameFilter!.test(c.name));
    console.log(`After name filter: ${components.length} component(s)`);
  }

  if (components.length === 0) {
    console.warn("No components found – nothing to generate.");
    process.exit(0);
  }

  // 3. Build deduplicated name map
  const idToName = deduplicateNames(components);

  // 4. Request SVG exports from Figma in batches
  console.log("Requesting SVG exports from Figma …");
  const allSvgUrls = new Map<string, string>();
  const batches = chunk(components, 50);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const ids = batch.map((c) => c.id).join(",");

    const response = (await figmaFetch(
      `/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=svg`,
      token,
    )) as { images: Record<string, string | null> };

    for (const [id, url] of Object.entries(response.images)) {
      if (url) {
        allSvgUrls.set(id, url);
      } else {
        console.warn(`  ⚠ No SVG URL returned for ${idToName.get(id) ?? id}`);
        errorCount++;
      }
    }

    if (i < batches.length - 1) {
      await sleep(config.rateLimitDelayMs);
    }
  }

  console.log(`Got ${allSvgUrls.size} SVG URL(s), downloading …`);

  // 5. Download SVGs with concurrency limit
  const svgContents = await downloadWithConcurrency(
    allSvgUrls,
    config.maxConcurrentDownloads,
  );

  console.log(`Downloaded ${svgContents.size} SVG(s), transforming …`);

  // 6. Ensure output directory exists
  const outputDir = path.resolve(config.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  // 7. Transform and write each icon
  let successCount = 0;

  for (const [nodeId, svgContent] of Array.from(svgContents.entries())) {
    const componentName = idToName.get(nodeId);
    if (!componentName) continue;

    try {
      const code = await svgToComponent(svgContent, componentName);
      const filePath = path.join(outputDir, `${componentName}.tsx`);
      fs.writeFileSync(filePath, code, "utf-8");
      successCount++;
    } catch (err) {
      console.warn(`  ⚠ Failed to transform ${componentName}: ${err}`);
      errorCount++;
    }
  }

  // 8. Summary
  console.log(`\nDone! Generated ${successCount} icon component(s) in ${config.outputDir}/`);

  if (errorCount > 0) {
    console.error(`${errorCount} error(s) occurred during generation.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
