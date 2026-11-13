import type { Challenge, DeriveKeyFunction } from "altcha/lib";

// A challenge with no solution after this delay is given up. The La Suite
// support API sends light challenges, solved in well under a second.
const SOLVE_TIMEOUT_MS = 30_000;

const isChallenge = (value: unknown): value is Challenge => {
  const parameters = (value as Challenge | null)?.parameters;
  return (
    !!parameters &&
    typeof parameters.algorithm === "string" &&
    typeof parameters.nonce === "string" &&
    typeof parameters.salt === "string" &&
    typeof parameters.keyPrefix === "string"
  );
};

export type AltchaSolution = {
  /** Base64 payload for the support API's `altcha` field. Works only once. */
  payload: string;
  /** When the challenge expires, in milliseconds since the epoch. */
  expiresAt?: number;
};

/**
 * Fetches an ALTCHA proof-of-work challenge and solves it.
 *
 * It uses `altcha/lib` directly instead of the `<altcha-widget>` element: the
 * check is invisible anyway, and this needs no CDN script nor Web Worker. The
 * library is loaded on first use only, so apps that never open a support form
 * don't download it.
 */
export const solveAltchaChallenge = async (
  challengeUrl: string,
): Promise<AltchaSolution> => {
  const response = await fetch(challengeUrl);
  if (!response.ok) {
    throw new Error(`ALTCHA challenge request failed (${response.status}).`);
  }
  const challenge: unknown = await response.json();
  if (!isChallenge(challenge)) {
    throw new Error("Unsupported ALTCHA challenge.");
  }

  const { solveChallenge, scrypt, sha, pbkdf2, argon2id } = await import(
    "altcha/lib"
  );
  const { algorithm } = challenge.parameters;
  let deriveKey: DeriveKeyFunction;
  if (algorithm === "SCRYPT") {
    deriveKey = scrypt.deriveKey;
  } else if (algorithm === "ARGON2ID") {
    deriveKey = argon2id.deriveKey;
  } else if (algorithm.startsWith("PBKDF2/")) {
    deriveKey = pbkdf2.deriveKey;
  } else if (algorithm.startsWith("SHA-")) {
    deriveKey = sha.deriveKey;
  } else {
    throw new Error(`Unsupported ALTCHA algorithm ${algorithm}.`);
  }

  const solution = await solveChallenge({
    challenge,
    deriveKey,
    counterMode: "uint32",
    timeout: SOLVE_TIMEOUT_MS,
  });
  if (!solution) {
    throw new Error("ALTCHA challenge could not be solved.");
  }

  // Same payload as the `<altcha-widget>` element builds for v2 challenges.
  const payload = btoa(
    JSON.stringify({
      challenge: {
        parameters: challenge.parameters,
        signature: challenge.signature,
      },
      solution,
    }),
  );
  const { expiresAt } = challenge.parameters;
  return { payload, expiresAt: expiresAt ? expiresAt * 1000 : undefined };
};
