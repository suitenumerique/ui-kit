import { describe, expect, it } from "vitest";
import { formatBytes, getFileIconName } from "./utils";

describe("formatBytes", () => {
  it("formats sizes across units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2 * 1024)).toBe("2 KB");
    expect(formatBytes(248 * 1024 * 1024)).toBe("248 MB");
    expect(formatBytes(12 * 1024 * 1024 * 1024)).toBe("12 GB");
  });

  it("returns '0 B' for invalid values", () => {
    expect(formatBytes(-1)).toBe("0 B");
    expect(formatBytes(NaN)).toBe("0 B");
  });
});

describe("getFileIconName", () => {
  it("derives an icon from the mimetype", () => {
    expect(getFileIconName("a.png", "image/png")).toBe("image");
    expect(getFileIconName("a.mp4", "video/mp4")).toBe("movie");
    expect(getFileIconName("a.pdf", "application/pdf")).toBe("picture_as_pdf");
  });

  it("falls back to the extension when there is no mimetype", () => {
    expect(getFileIconName("photo.JPG")).toBe("image");
    expect(getFileIconName("archive.zip")).toBe("folder_zip");
    expect(getFileIconName("notes.txt")).toBe("description");
  });

  it("defaults to a generic document icon", () => {
    expect(getFileIconName()).toBe("description");
    expect(getFileIconName("unknown")).toBe("description");
  });
});
