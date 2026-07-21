import { describe, it, expect } from "vitest";
import {
  parseShareImportFile,
  DEFAULT_MAX_IMPORT_ROWS,
  MAX_IMPORT_FILE_SIZE,
} from "./utils";

const csvFile = (content: string, name = "contacts.csv") =>
  new File([content], name);

describe("parseShareImportFile", () => {
  it("parses a comma-separated CSV", async () => {
    const result = await parseShareImportFile(
      csvFile("alice@example.com,admin\nbob@example.com,viewer"),
    );
    expect(result.rows).toEqual([
      { email: "alice@example.com", role: "admin" },
      { email: "bob@example.com", role: "viewer" },
    ]);
  });

  it("parses a semicolon-separated CSV", async () => {
    const result = await parseShareImportFile(
      csvFile("alice@example.com;admin\nbob@example.com;viewer"),
    );
    expect(result.rows).toEqual([
      { email: "alice@example.com", role: "admin" },
      { email: "bob@example.com", role: "viewer" },
    ]);
  });

  it("handles CRLF line endings and trailing blank lines", async () => {
    const result = await parseShareImportFile(
      csvFile("alice@example.com,admin\r\nbob@example.com,viewer\r\n\r\n"),
    );
    expect(result.rows).toHaveLength(2);
  });

  it("strips a leading BOM", async () => {
    const result = await parseShareImportFile(
      csvFile("﻿alice@example.com,admin"),
    );
    expect(result.rows).toEqual([
      { email: "alice@example.com", role: "admin" },
    ]);
  });

  it("handles quoted fields containing the delimiter and escaped quotes", async () => {
    const result = await parseShareImportFile(
      csvFile('"alice@example.com","role, with ""comma"""'),
    );
    expect(result.rows).toEqual([
      { email: "alice@example.com", role: 'role, with "comma"' },
    ]);
  });

  it("trims whitespace around fields", async () => {
    const result = await parseShareImportFile(
      csvFile(" alice@example.com , admin "),
    );
    expect(result.rows).toEqual([
      { email: "alice@example.com", role: "admin" },
    ]);
  });

  it("fails on a row with a single column", async () => {
    const result = await parseShareImportFile(
      csvFile("alice@example.com,admin\nbob@example.com"),
    );
    expect(result.error).toEqual({ type: "invalid_row", row: 2 });
  });

  it("fails on a row with three columns", async () => {
    const result = await parseShareImportFile(
      csvFile("alice@example.com,admin,extra"),
    );
    expect(result.error).toEqual({ type: "invalid_row", row: 1 });
  });

  it("fails on a row with an empty email or role", async () => {
    expect(
      (await parseShareImportFile(csvFile(",admin"))).error,
    ).toEqual({ type: "invalid_row", row: 1 });
    expect(
      (await parseShareImportFile(csvFile("alice@example.com,"))).error,
    ).toEqual({ type: "invalid_row", row: 1 });
  });

  it("reports the 1-based row number of the original file, counting blank lines", async () => {
    const result = await parseShareImportFile(
      csvFile("alice@example.com,admin\n\nbob@example.com"),
    );
    expect(result.error).toEqual({ type: "invalid_row", row: 3 });
  });

  it("fails on an empty file", async () => {
    const result = await parseShareImportFile(csvFile("\n\n"));
    expect(result.error).toEqual({ type: "empty" });
  });

  it("fails on a file larger than 10 MB", async () => {
    const result = await parseShareImportFile(
      csvFile("a".repeat(MAX_IMPORT_FILE_SIZE + 1)),
    );
    expect(result.error).toEqual({ type: "file_too_large" });
  });

  it("fails on a file with more rows than the default maximum", async () => {
    const content = Array.from(
      { length: DEFAULT_MAX_IMPORT_ROWS + 1 },
      (_, index) => `user.${index}@example.com,admin`,
    ).join("\n");
    const result = await parseShareImportFile(csvFile(content));
    expect(result.error).toEqual({
      type: "too_many_rows",
      max: DEFAULT_MAX_IMPORT_ROWS,
    });
  });

  it("accepts a file with exactly the maximum number of rows", async () => {
    const content = Array.from(
      { length: DEFAULT_MAX_IMPORT_ROWS },
      (_, index) => `user.${index}@example.com,admin`,
    ).join("\n");
    const result = await parseShareImportFile(csvFile(content));
    expect(result.rows).toHaveLength(DEFAULT_MAX_IMPORT_ROWS);
  });

  it("honors a custom maxRows option", async () => {
    const content = "alice@example.com,admin\nbob@example.com,viewer";
    const result = await parseShareImportFile(csvFile(content), {
      maxRows: 1,
    });
    expect(result.error).toEqual({ type: "too_many_rows", max: 1 });
    const withinLimit = await parseShareImportFile(csvFile(content), {
      maxRows: 2,
    });
    expect(withinLimit.rows).toHaveLength(2);
  });

  it("fails on an unreadable xlsx file", async () => {
    const result = await parseShareImportFile(
      new File(["not an xlsx"], "contacts.xlsx"),
    );
    expect(result.error).toEqual({ type: "unreadable" });
  });
});
