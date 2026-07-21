import { describe, expect, it } from "vitest";
import { formatBytes } from "./utils";

describe("formatBytes", () => {
  it("formats sizes across units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2 * 1000)).toBe("2 KB");
    expect(formatBytes(248 * 1000 * 1000)).toBe("248 MB");
    expect(formatBytes(12 * 1000 * 1000 * 1000)).toBe("12 GB");
  });

  it("uses decimal unit thresholds", () => {
    expect(formatBytes(999)).toBe("999 B");
    expect(formatBytes(1000)).toBe("1 KB");
    expect(formatBytes(1000 * 1000)).toBe("1 MB");
    expect(formatBytes(1000 * 1000 * 1000)).toBe("1 GB");
  });

  it("returns '0 B' for invalid values", () => {
    expect(formatBytes(-1)).toBe("0 B");
    expect(formatBytes(NaN)).toBe("0 B");
  });
});
