import { test, expect } from "@playwright/experimental-ct-react";
import type { Page, Request } from "@playwright/test";
import { createChallenge, scrypt, verifySolution } from "altcha/lib";
import { TestLaSuiteSupportForm } from "../helpers/mount-la-suite-support-form";

const API = "/api/support";
const HMAC_SECRET = "test-secret";

/** Read the callbacks recorded by the in-browser mount helper. */
const getCalls = (page: Page) =>
  page.evaluate(() => window.__laSuiteSupportFormCalls ?? []);

/**
 * Stand in for the support API: serve a real ALTCHA challenge (same
 * parameters as production) and answer `deliver/` with the given response.
 * Returns the captured `deliver/` request and the number of challenges served.
 */
const mockLaSuiteSupportApi = async (
  page: Page,
  deliverResponse: { status: number; body: object },
) => {
  let challengeCount = 0;
  await page.route(`**${API}/challenge`, async (route) => {
    challengeCount++;
    const challenge = await createChallenge({
      algorithm: "SCRYPT",
      cost: 1024,
      memoryCost: 8,
      keyLength: 32,
      keyPrefixLength: 1,
      deriveKey: scrypt.deriveKey,
      hmacSignatureSecret: HMAC_SECRET,
    });
    await route.fulfill({ json: challenge });
  });

  let deliverRequest: Request | undefined;
  await page.route(`**${API}/deliver/`, async (route) => {
    deliverRequest = route.request();
    await route.fulfill({
      status: deliverResponse.status,
      json: deliverResponse.body,
    });
  });
  return {
    getDeliverRequest: () => deliverRequest,
    getChallengeCount: () => challengeCount,
  };
};

const fillForm = async (page: Page) => {
  await page.getByRole("textbox", { name: "Subject" }).fill("Upload is broken");
  await page
    .getByRole("textbox", { name: "Your message" })
    .fill("The upload button does nothing.");
};

test.describe("LaSuiteSupportForm", () => {
  test("Sends the request to the support API and shows the success view", async ({
    mount,
    page,
  }) => {
    // 1. The API accepts the request.
    const { getDeliverRequest } = await mockLaSuiteSupportApi(page, {
      status: 200,
      body: { success: true },
    });

    // 2. Open the form: the support rules are applied (required email, upload
    //    hint for the accepted files).
    await mount(<TestLaSuiteSupportForm api={API} channel="docs" />);
    await page.getByRole("button", { name: "Open form" }).click();
    await expect(
      page.getByText("Image (png, jpg, gif) or text file (txt), up to 10 MB"),
    ).toBeVisible();
    await expect(page.getByRole("checkbox")).toHaveCount(0);

    // 3. Fill the form, attach a text file and send.
    await fillForm(page);
    await page
      .getByRole("textbox", { name: "E-mail" })
      .fill("jean.dupont@example.gouv.fr");
    await page.locator('input[type="file"]').setInputFiles({
      name: "logs.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("error at line 42"),
    });
    await page.getByRole("button", { name: "Send" }).click();

    // 4. The success view uses the support wording, and onSuccess fired.
    await expect(
      page.getByRole("heading", { name: "Thank you for your feedback" }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText(
        "If needed, a member of our support team will contact you by e-mail.",
      ),
    ).toBeVisible();
    expect(await getCalls(page)).toEqual([{ type: "success" }]);

    // 5. The request follows the support API contract.
    const request = getDeliverRequest();
    expect(request).toBeDefined();
    expect(request!.method()).toBe("POST");
    expect(request!.headers()["x-channel-id"]).toBe("docs");
    const body = request!.postDataJSON();
    expect(body).toEqual({
      subject: "Upload is broken",
      textBody: "The upload button does nothing.",
      email: "jean.dupont@example.gouv.fr",
      channel: "docs",
      altcha: expect.any(String),
      notify_sender: true,
      attachments: [
        {
          fileName: "logs.txt",
          mimeType: "text/plain",
          data: Buffer.from("error at line 42").toString("base64"),
        },
      ],
    });

    // 6. The anti-spam payload solved in the browser passes the server check.
    const payload = JSON.parse(
      Buffer.from(body.altcha, "base64").toString("utf-8"),
    );
    const verification = await verifySolution({
      challenge: payload.challenge,
      solution: payload.solution,
      deriveKey: scrypt.deriveKey,
      hmacSignatureSecret: HMAC_SECRET,
      counterMode: "uint32",
    });
    expect(verification.verified).toBe(true);
  });

  test("Runs the anti-spam check when the form opens", async ({
    mount,
    page,
  }) => {
    // 1. The API accepts the request.
    const { getChallengeCount } = await mockLaSuiteSupportApi(page, {
      status: 200,
      body: { success: true },
    });
    await mount(
      <TestLaSuiteSupportForm
        api={API}
        channel="docs"
        email="jean.dupont@example.gouv.fr"
      />,
    );

    // 2. Opening the form fetches the challenge right away, so it is solved
    //    while the user writes, not after they click Send.
    await page.getByRole("button", { name: "Open form" }).click();
    await expect.poll(getChallengeCount).toBe(1);

    // 3. The send uses that solution: no second challenge is fetched.
    await fillForm(page);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(
      page.getByRole("heading", { name: "Thank you for your feedback" }),
    ).toBeVisible({ timeout: 15_000 });
    expect(getChallengeCount()).toBe(1);
  });

  test("Shows the API error and keeps the draft", async ({ mount, page }) => {
    // 1. The API refuses the request with a reason.
    await mockLaSuiteSupportApi(page, {
      status: 429,
      body: {
        success: false,
        detail: "Too many requests. Please try again later.",
      },
    });

    // 2. The app knows the user's email: the form does not ask for it.
    await mount(
      <TestLaSuiteSupportForm
        api={API}
        channel="docs"
        email="jean.dupont@example.gouv.fr"
      />,
    );
    await page.getByRole("button", { name: "Open form" }).click();
    await expect(page.getByRole("textbox", { name: "E-mail" })).toHaveCount(0);

    // 3. Send: the reason is announced and onError fired with it.
    await fillForm(page);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Too many requests. Please try again later.",
      { timeout: 15_000 },
    );
    expect(await getCalls(page)).toEqual([
      { type: "error", message: "Too many requests. Please try again later." },
    ]);

    // 4. The draft is still there, ready to be sent again.
    await expect(page.getByRole("textbox", { name: "Subject" })).toHaveValue(
      "Upload is broken",
    );
  });
});
