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

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(packageRoot, "src"), dist, { recursive: true });
await writeFile(
  resolve(dist, "icon-manifest.json"),
  `${JSON.stringify(iconNames, null, 2)}\n`,
);
await import("node:fs/promises").then(({ chmod }) =>
  chmod(resolve(dist, "cli.js"), 0o755),
);
