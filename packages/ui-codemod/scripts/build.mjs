import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iconsBarrel = resolve(
  packageRoot,
  "../ui-components/src/components/icon/icons/index.ts",
);
const dist = resolve(packageRoot, "dist");

const iconSource = await readFile(iconsBarrel, "utf8");
const iconNames = Array.from(
  iconSource.matchAll(/export\s*\{\s*([A-Za-z_$][\w$]*)\s*\}/g),
  (match) => match[1],
).sort();

if (iconNames.length === 0) {
  throw new Error(`No SVG icon exports found in ${iconsBarrel}`);
}

// Names exported from the package root, so that the ui-kit import splitter can
// tell components apart from icons when a name exists on both sides
// (Filter, Calendar, Loader, ...).
const rootBarrel = resolve(packageRoot, "../ui-components/src/index.ts");
const rootSource = await readFile(rootBarrel, "utf8");
const rootNames = Array.from(
  new Set(
    Array.from(
      rootSource.matchAll(/export(?:\s+type)?\s*\{([^}]*)\}/g),
      (match) => match[1],
    )
      .flatMap((block) => block.split(","))
      .map((name) => name.trim().replace(/^type\s+/, ""))
      .map((name) => name.split(/\s+as\s+/).pop())
      .filter(Boolean),
  ),
).sort();

if (rootNames.length === 0) {
  throw new Error(`No root exports found in ${rootBarrel}`);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(packageRoot, "src"), dist, { recursive: true });
await writeFile(
  resolve(dist, "icon-manifest.json"),
  `${JSON.stringify(iconNames, null, 2)}\n`,
);
await writeFile(
  resolve(dist, "root-manifest.json"),
  `${JSON.stringify(rootNames, null, 2)}\n`,
);
await import("node:fs/promises").then(({ chmod }) =>
  chmod(resolve(dist, "cli.js"), 0o755),
);
