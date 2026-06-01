import { describe, expect, it } from "vitest";
import {
  formatStorageNumber,
  getStorageGaugePercentage,
  getStorageGaugeStatus,
} from "./utils";

describe("getStorageGaugeStatus", () => {
  it("returns 'default' below the warning threshold", () => {
    expect(getStorageGaugeStatus(1.8, 10)).toBe("default");
    expect(getStorageGaugeStatus(0, 10)).toBe("default");
  });

  it("returns 'warning' at or above the warning threshold", () => {
    expect(getStorageGaugeStatus(9, 10)).toBe("warning");
    expect(getStorageGaugeStatus(9.1, 10)).toBe("warning");
  });

  it("returns 'full' at or above the full threshold", () => {
    expect(getStorageGaugeStatus(10, 10)).toBe("full");
    expect(getStorageGaugeStatus(12, 10)).toBe("full");
  });

  it("honours custom thresholds", () => {
    expect(getStorageGaugeStatus(5, 10, 0.5, 0.8)).toBe("warning");
    expect(getStorageGaugeStatus(8, 10, 0.5, 0.8)).toBe("full");
  });

  it("treats a zero or negative total as empty", () => {
    expect(getStorageGaugeStatus(5, 0)).toBe("default");
  });
});

describe("getStorageGaugePercentage", () => {
  it("computes the fill percentage", () => {
    expect(getStorageGaugePercentage(1.8, 10)).toBeCloseTo(18);
  });

  it("clamps to the 0-100 range", () => {
    expect(getStorageGaugePercentage(20, 10)).toBe(100);
    expect(getStorageGaugePercentage(-5, 10)).toBe(0);
  });

  it("returns 0 when total is not positive", () => {
    expect(getStorageGaugePercentage(5, 0)).toBe(0);
  });
});

describe("formatStorageNumber", () => {
  it("formats with the requested number of decimals", () => {
    expect(formatStorageNumber(1.8, "en-US", 2)).toBe("1.80");
    expect(formatStorageNumber(1.8, "en-US", 0)).toBe("2");
  });
});
