import { beforeEach, describe, expect, it } from "vitest";
import { createChallenge, scrypt, verifySolution } from "altcha/lib";
import { solveAltchaChallenge } from "./altcha";

const HMAC_SECRET = "test-secret";
const EXPIRES_AT_SECONDS = Math.floor(Date.now() / 1000) + 600;

describe("solveAltchaChallenge", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("returns a payload the server accepts", async () => {
    // Same parameters as the La Suite support API's challenges.
    const challenge = await createChallenge({
      algorithm: "SCRYPT",
      cost: 1024,
      memoryCost: 8,
      keyLength: 32,
      keyPrefixLength: 1,
      deriveKey: scrypt.deriveKey,
      hmacSignatureSecret: HMAC_SECRET,
      expiresAt: EXPIRES_AT_SECONDS,
    });
    fetchMock.mockResponseOnce(JSON.stringify(challenge));

    const { payload, expiresAt } = await solveAltchaChallenge(
      "https://support.test/api/support/challenge",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://support.test/api/support/challenge",
    );
    const decoded = JSON.parse(atob(payload));
    const result = await verifySolution({
      challenge: decoded.challenge,
      solution: decoded.solution,
      deriveKey: scrypt.deriveKey,
      hmacSignatureSecret: HMAC_SECRET,
      counterMode: "uint32",
    });
    expect(result.verified).toBe(true);
    // The expiry comes back in milliseconds, ready to compare with Date.now().
    expect(expiresAt).toBe(EXPIRES_AT_SECONDS * 1000);
  });

  it("rejects a response that is not a challenge", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: false }));

    await expect(
      solveAltchaChallenge("https://support.test/api/support/challenge"),
    ).rejects.toThrow("Unsupported ALTCHA challenge.");
  });

  it("rejects when the challenge request fails", async () => {
    fetchMock.mockResponseOnce("", { status: 503 });

    await expect(
      solveAltchaChallenge("https://support.test/api/support/challenge"),
    ).rejects.toThrow("ALTCHA challenge request failed (503).");
  });
});
