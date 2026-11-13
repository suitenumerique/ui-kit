// Stories only: a fake La Suite support API, so the stories never send a real
// support email. It wraps `window.fetch` and answers the requests made to
// `MOCK_LA_SUITE_SUPPORT_API`: a real (unsigned) ALTCHA challenge, and a `deliver/`
// that accepts the request, or refuses it when the subject contains "error".

export const MOCK_LA_SUITE_SUPPORT_API = "/mock-support-api/";

let isInstalled = false;

export const installMockLaSuiteSupportApi = () => {
  if (isInstalled || typeof window === "undefined") return;
  isInstalled = true;

  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;

    if (url.endsWith(`${MOCK_LA_SUITE_SUPPORT_API}challenge`)) {
      const { createChallenge, scrypt } = await import("altcha/lib");
      const challenge = await createChallenge({
        algorithm: "SCRYPT",
        cost: 1024,
        memoryCost: 8,
        keyLength: 32,
        keyPrefixLength: 1,
        deriveKey: scrypt.deriveKey,
      });
      return Response.json(challenge);
    }

    if (url.endsWith(`${MOCK_LA_SUITE_SUPPORT_API}deliver/`)) {
      const body = JSON.parse(String(init?.body ?? "{}"));
      console.log("Support request", body);
      if (String(body.subject).toLowerCase().includes("error")) {
        return Response.json(
          {
            success: false,
            detail: "Too many requests. Please try again later.",
          },
          { status: 429 },
        );
      }
      return Response.json({ success: true });
    }

    return realFetch(input, init);
  };
};
