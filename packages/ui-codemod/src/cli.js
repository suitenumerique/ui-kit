#!/usr/bin/env node
import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { transformJavaScript, transformPackageJson, transformStyles } from "./transform.js";

const usage = `Usage: ui-codemod migrate [path] [--source all|ui-kit|cunningham] [--write] [--check]

The command is read-only by default. Use --write to update files in place.
Lockfiles, dependencies, build outputs and generated files are always ignored.`;

function parseArguments(argv) {
  if (argv[0] !== "migrate") throw new Error(usage);
  const options = { path: ".", source: "all", write: false, check: false };
  let pathSet = false;
  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--write") options.write = true;
    else if (argument === "--check") options.check = true;
    else if (argument === "--source") options.source = argv[++index];
    else if (argument.startsWith("--source=")) options.source = argument.slice("--source=".length);
    else if (!argument.startsWith("-") && !pathSet) {
      options.path = argument;
      pathSet = true;
    } else throw new Error(`Unknown argument: ${argument}\n\n${usage}`);
  }
  if (!new Set(["all", "ui-kit", "cunningham"]).has(options.source)) {
    throw new Error(`Invalid --source value: ${options.source}`);
  }
  if (options.write && options.check) throw new Error("--write and --check cannot be used together.");
  return options;
}

async function collectFiles(target) {
  const targetStat = await stat(target);
  if (targetStat.isFile()) return [target];
  return fg(
    ["**/*.{js,jsx,ts,tsx,mjs,cjs,css,scss,sass}", "**/package.json"],
    {
      cwd: target,
      absolute: true,
      onlyFiles: true,
      dot: true,
      ignore: [
        "**/.git/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/storybook-static/**",
        "**/*.lock",
        "**/yarn.lock",
        "**/package-lock.json",
        "**/pnpm-lock.yaml",
        "**/cunningham-tokens.{js,ts,css,scss}",
      ],
    },
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const target = resolve(process.cwd(), options.path);
  const packageRoot = dirname(fileURLToPath(import.meta.url));
  const iconNames = JSON.parse(await readFile(resolve(packageRoot, "icon-manifest.json"), "utf8"));
  const files = await collectFiles(target);
  const changes = [];
  const issues = [];

  for (const filePath of files) {
    const input = await readFile(filePath, "utf8");
    let result;
    if (filePath.endsWith("package.json")) {
      result = transformPackageJson(input, filePath, options);
    } else if (/\.(?:css|scss|sass)$/.test(filePath)) {
      result = transformStyles(input, filePath, options);
    } else {
      result = transformJavaScript(input, filePath, { ...options, iconNames });
    }
    issues.push(...result.issues);
    if (!result.changed) continue;
    changes.push(filePath);
    if (options.write) await writeFile(filePath, result.output);
  }

  for (const filePath of changes) {
    console.log(`${options.write ? "updated" : "would update"} ${filePath}`);
  }
  for (const item of issues) {
    console.error(`warning ${item.filePath}${item.line ? `:${item.line}` : ""} ${item.message}`);
  }
  console.log(`${changes.length} file(s) ${options.write ? "updated" : "to update"}; ${issues.length} warning(s).`);
  if (options.check && (changes.length > 0 || issues.length > 0)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 2;
});
