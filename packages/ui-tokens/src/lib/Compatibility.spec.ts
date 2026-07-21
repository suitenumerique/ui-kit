import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sha256 = (filePath: string) =>
  createHash("sha256").update(readFileSync(filePath)).digest("hex");

describe("Cunningham 3.1.0 generator compatibility", () => {
  it.each([
    ["css", "c90fe0705125334bb1e92df5d5c5a138d50e63412187a5f6414f0b100ede45e6"],
    ["scss", "a39534913be442054a14ea7a2800446e548aff30ee39841f6c23aa29e80ca2c2"],
    ["ts", "3e750723da105b9b909942479456d0fc3cf600e612e64456ac2091febcda208b"],
  ])("keeps the default %s output byte-for-byte identical", (extension, expected) => {
    const output = resolve(__dirname, `../../dist/cunningham-tokens.${extension}`);
    expect(sha256(output)).toBe(expected);
  });
});
