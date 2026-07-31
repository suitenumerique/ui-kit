import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { transformJavaScript, transformPackageJson, transformStyles } from "../dist/transform.js";

const root = dirname(fileURLToPath(import.meta.url));
const iconNames = JSON.parse(await readFile(resolve(root, "../dist/icon-manifest.json"), "utf8"));

test("splits mixed UI Kit component and SVG icon imports while preserving aliases and types", () => {
  const input = `import { Button as Action, ArrowDown, type ButtonProps } from "@gouvfr-lasuite/ui-kit";\n`;
  const result = transformJavaScript(input, "example.tsx", { source: "all", iconNames });
  assert.match(result.output, /Button as Action, type ButtonProps.*ui-components/s);
  assert.match(result.output, /ArrowDown.*ui-components\/icons/s);
  assert.equal(result.issues.length, 0);
});

test("rewrites types, re-exports and deterministic CommonJS imports", () => {
  const input = `export type { ButtonProps as Props } from "@gouvfr-lasuite/cunningham-react";\nconst tokens = require("@gouvfr-lasuite/cunningham-tokens");\n`;
  const result = transformJavaScript(input, "example.ts", { source: "all", iconNames });
  assert.match(result.output, /ui-components/);
  assert.match(result.output, /ui-tokens/);
});

test("reports namespace and internal imports without changing them", () => {
  const input = `import * as UI from "@gouvfr-lasuite/ui-kit";\nimport x from "@gouvfr-lasuite/cunningham-react/internal";\n`;
  const result = transformJavaScript(input, "example.ts", { source: "all", iconNames });
  assert.equal(result.output, input);
  assert.equal(result.issues.length, 2);
});

test("rewrites Sass and CSS public subpaths", () => {
  const input = `@use "@gouvfr-lasuite/cunningham-react/sass/icons";\n@import "@gouvfr-lasuite/ui-kit/fonts/Marianne";\n`;
  const result = transformStyles(input, "theme.scss", { source: "all" });
  assert.match(result.output, /ui-components\/sass\/material-icons/);
  assert.match(result.output, /ui-components\/fonts\/marianne/);
});

test("merges package dependencies and is idempotent", () => {
  const input = `${JSON.stringify({ dependencies: {
    "@gouvfr-lasuite/ui-kit": "^0.27.0",
    "@gouvfr-lasuite/cunningham-react": "^4.3.1",
    "@gouvfr-lasuite/cunningham-tokens": "^3.1.0",
  } }, null, 2)}\n`;
  const first = transformPackageJson(input, "package.json", { source: "all" });
  const second = transformPackageJson(first.output, "package.json", { source: "all" });
  assert.equal(JSON.parse(first.output).dependencies["@gouvfr-lasuite/ui-components"], "^1.0.0");
  assert.equal(JSON.parse(first.output).dependencies["@gouvfr-lasuite/ui-tokens"], "^1.0.0");
  assert.equal(second.changed, false);
});

test("rewrites legacy @openfun/cunningham-* packages", () => {
  const input = `import { Button } from "@openfun/cunningham-react";\nimport "@openfun/cunningham-react/style";\nconst tokens = require("@openfun/cunningham-tokens");\n`;
  const result = transformJavaScript(input, "example.tsx", { source: "cunningham", iconNames });
  assert.match(result.output, /from "@gouvfr-lasuite\/ui-components"/);
  assert.match(result.output, /"@gouvfr-lasuite\/ui-components\/style"/);
  assert.match(result.output, /"@gouvfr-lasuite\/ui-tokens"/);
  assert.equal(result.issues.length, 0);
});

test("rewrites legacy @openfun styles and package.json dependencies", () => {
  const styles = transformStyles(`@use "@openfun/cunningham-react/sass/icons";\n`, "theme.scss", { source: "all" });
  assert.match(styles.output, /ui-components\/sass\/material-icons/);
  const pkg = transformPackageJson(`${JSON.stringify({ dependencies: {
    "@openfun/cunningham-react": "^3.0.0",
    "@openfun/cunningham-tokens": "^2.0.0",
  } }, null, 2)}\n`, "package.json", { source: "all" });
  const dependencies = JSON.parse(pkg.output).dependencies;
  assert.equal(dependencies["@gouvfr-lasuite/ui-components"], "^1.0.0");
  assert.equal(dependencies["@gouvfr-lasuite/ui-tokens"], "^1.0.0");
  assert.equal("@openfun/cunningham-react" in dependencies, false);
});

test("JavaScript transforms are idempotent", () => {
  const input = `import { Button, ArrowDown } from "@gouvfr-lasuite/ui-kit";\n`;
  const first = transformJavaScript(input, "example.tsx", { source: "all", iconNames });
  const second = transformJavaScript(first.output, "example.tsx", { source: "all", iconNames });
  assert.equal(second.changed, false);
});

test("CLI is dry-run by default and --write applies the migration", async () => {
  const directory = await mkdtemp(resolve(tmpdir(), "ui-codemod-"));
  const fixture = resolve(directory, "example.ts");
  const input = `import { Button } from "@gouvfr-lasuite/ui-kit";\n`;
  await writeFile(fixture, input);

  const cli = resolve(root, "../dist/cli.js");
  const dryRun = spawnSync(process.execPath, [cli, "migrate", directory, "--source", "all"], { encoding: "utf8" });
  assert.equal(dryRun.status, 0);
  assert.equal(await readFile(fixture, "utf8"), input);

  const check = spawnSync(process.execPath, [cli, "migrate", directory, "--check"], { encoding: "utf8" });
  assert.equal(check.status, 1);

  const write = spawnSync(process.execPath, [cli, "migrate", directory, "--write"], { encoding: "utf8" });
  assert.equal(write.status, 0);
  assert.match(await readFile(fixture, "utf8"), /ui-components/);
  await rm(directory, { recursive: true, force: true });
});
