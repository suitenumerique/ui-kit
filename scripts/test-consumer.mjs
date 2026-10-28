import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const compiler = process.argv[2];
if (!["6", "7"].includes(compiler)) {
  throw new Error("Usage: yarn test:consumer <6|7> (run yarn build first)");
}
const root = fileURLToPath(new URL("../", import.meta.url));
const directory = mkdtempSync(join(tmpdir(), "ui-kit-consumer-"));
const run = (command, args, cwd = directory) =>
  execFileSync(command, args, { cwd, stdio: "inherit" });

try {
  // Pack the actual publishable artifacts, not workspace symlinks. npm checks
  // peer ranges that Yarn 1 only warns about during the workspace install.
  const archives = ["ui-tokens", "ui-components"].map((name) => {
    const output = execFileSync(
      "npm",
      ["pack", "--json", "--pack-destination", directory],
      {
        cwd: resolve(root, "packages", name),
        encoding: "utf8",
      },
    );
    return join(directory, JSON.parse(output)[0].filename);
  });
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify({
      name: "ui-kit-consumer-check",
      private: true,
      type: "module",
    }),
  );
  run("npm", [
    "install",
    "--strict-peer-deps",
    "--legacy-peer-deps=false",
    "--no-audit",
    "--no-fund",
    ...archives,
    `typescript@${compiler}`,
    "react@19",
    "react-dom@19",
    "@types/react@19",
    "@types/react-dom@19",
    "@tanstack/react-query@5",
  ]);
  writeFileSync(
    join(directory, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ["consumer.tsx", "cunningham.ts"],
    }),
  );
  writeFileSync(
    join(directory, "consumer.tsx"),
    `
import { Button } from "@gouvfr-lasuite/ui-components";
import * as icons from "@gouvfr-lasuite/ui-components/icons";
export const button = <Button>Consumer check</Button>;
export const iconNames = Object.keys(icons);
`,
  );
  writeFileSync(
    join(directory, "cunningham.ts"),
    `
import * as tokens from "@gouvfr-lasuite/ui-tokens";
export const tokenExports = Object.keys(tokens);
const config = { themes: { default: { globals: { colors: { "consumer-check": "#123456" } } } } };
export default config;
`,
  );
  run(join(directory, "node_modules/.bin/tsc"), ["--project", "tsconfig.json"]);
  // This also tests loading a TS config inside an ESM consumer. Typechecking
  // alone does not catch a loader depending on the removed TS7 compiler API.
  run(join(directory, "node_modules/.bin/cunningham"), [
    "-g",
    "css",
    "-o",
    "theme",
  ]);
  if (
    !readFileSync(
      join(directory, "theme/cunningham-tokens.css"),
      "utf8",
    ).includes("#123456")
  ) {
    throw new Error(
      "Theme generation did not load the consumer's TypeScript config",
    );
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
