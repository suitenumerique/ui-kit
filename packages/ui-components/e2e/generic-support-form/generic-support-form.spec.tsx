import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestGenericSupportForm } from "../helpers/mount-generic-support-form";

/** Read the callbacks recorded by the in-browser mount helper. */
const getCalls = (page: Page) =>
  page.evaluate(() => window.__genericSupportFormCalls ?? []);

const openForm = (page: Page) =>
  page.getByRole("button", { name: "Open form" }).click();

const subjectField = (page: Page) =>
  page.getByRole("textbox", { name: "Subject" });
const messageField = (page: Page) =>
  page.getByRole("textbox", { name: "Your message" });
const emailField = (page: Page) =>
  page.getByRole("textbox", { name: "E-mail" });
const sendButton = (page: Page) => page.getByRole("button", { name: "Send" });

const fillMessage = async (page: Page) => {
  await subjectField(page).fill("Upload is broken");
  await messageField(page).fill("The upload button does nothing.");
};

test.describe("GenericSupportForm - validation", () => {
  test("Shows the errors on submit and focuses the first invalid field", async ({
    mount,
    page,
  }) => {
    // 1. Open an empty form and submit it right away.
    await mount(<TestGenericSupportForm />);
    await openForm(page);
    await sendButton(page).click();

    // 2. Both required fields show their error, and the focus moves to the
    //    first one so keyboard and screen reader users land on it.
    await expect(page.getByText("The subject is required.")).toBeVisible();
    await expect(page.getByText("The message is required.")).toBeVisible();
    await expect(subjectField(page)).toBeFocused();
    await expect(subjectField(page)).toHaveAttribute("aria-invalid", "true");

    // 3. Once the subject is filled, the next submit focuses the message.
    await subjectField(page).fill("Upload is broken");
    await expect(page.getByText("The subject is required.")).toHaveCount(0);
    await sendButton(page).click();
    await expect(messageField(page)).toBeFocused();

    // 4. Nothing was sent while the form was invalid.
    expect(await getCalls(page)).toEqual([]);
  });

  test("Requires a valid email when requireEmail is set", async ({
    mount,
    page,
  }) => {
    // 1. With requireEmail, an email field replaces the reply checkbox.
    await mount(<TestGenericSupportForm requireEmail />);
    await openForm(page);
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await fillMessage(page);

    // 2. An empty email blocks the send and gets the focus.
    await sendButton(page).click();
    await expect(
      page.getByText("The e-mail is required. Format: name@domain.com"),
    ).toBeVisible();
    await expect(emailField(page)).toBeFocused();

    // 3. A malformed email is rejected with another message.
    await emailField(page).fill("jean.dupont");
    await expect(
      page.getByText("Please enter a valid e-mail address."),
    ).toBeVisible();

    // 4. A valid email is sent with the data.
    await emailField(page).fill("jean.dupont@example.gouv.fr");
    await sendButton(page).click();
    await expect(async () => {
      expect(await getCalls(page)).toContainEqual({
        type: "send",
        data: expect.objectContaining({ email: "jean.dupont@example.gouv.fr" }),
      });
    }).toPass({ timeout: 5000 });
  });

  test("Does not ask for an email the app already knows", async ({
    mount,
    page,
  }) => {
    // 1. The app passes the user's email: no email field is shown.
    await mount(
      <TestGenericSupportForm
        requireEmail
        email="jean.dupont@example.gouv.fr"
      />,
    );
    await openForm(page);
    await expect(emailField(page)).toHaveCount(0);

    // 2. The known email is sent with the data.
    await fillMessage(page);
    await sendButton(page).click();
    await expect(async () => {
      expect(await getCalls(page)).toContainEqual({
        type: "send",
        data: expect.objectContaining({ email: "jean.dupont@example.gouv.fr" }),
      });
    }).toPass({ timeout: 5000 });
  });
});

test.describe("GenericSupportForm - sending", () => {
  test("Shows the success view when onSend resolves", async ({
    mount,
    page,
  }) => {
    // 1. Fill the form and send it. onSend resolves after a short delay.
    await mount(<TestGenericSupportForm sendDelayMs={500} />);
    await openForm(page);
    await fillMessage(page);
    await sendButton(page).click();

    // 2. The button shows the sending state while the promise is pending.
    await expect(page.getByRole("button", { name: "Sending…" })).toBeVisible();

    // 3. The success view replaces the form, and its Close button gets the
    //    focus because the Send button it came from is gone.
    await expect(
      page.getByRole("heading", { name: "Thank you for your feedback" }),
    ).toBeVisible();
    await expect(
      page.getByText("Your message has been sent to the team."),
    ).toBeVisible();
    const closeButton = page.getByRole("button", {
      name: "Close",
      exact: true,
    });
    await expect(closeButton).toBeFocused();
    expect(await getCalls(page)).toContainEqual({
      type: "send",
      data: {
        subject: "Upload is broken",
        message: "The upload button does nothing.",
      },
    });

    // 4. Closing the success view closes the form and fires onSuccessClose.
    await closeButton.click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(await getCalls(page)).toContainEqual({ type: "successClose" });

    // 5. The next opening starts with an empty form.
    await openForm(page);
    await expect(subjectField(page)).toHaveValue("");
    await expect(messageField(page)).toHaveValue("");
  });

  test("Shows the error message when onSend rejects", async ({
    mount,
    page,
  }) => {
    // 1. onSend rejects with an error message from the backend.
    await mount(
      <TestGenericSupportForm
        sendOutcome="reject"
        rejectMessage="Too many requests. Please try again later."
      />,
    );
    await openForm(page);
    await fillMessage(page);
    await sendButton(page).click();

    // 2. The message is announced, and the draft is kept so the user can
    //    send it again.
    await expect(page.getByRole("alert")).toHaveText(
      "Too many requests. Please try again later.",
    );
    await expect(subjectField(page)).toHaveValue("Upload is broken");
    await expect(sendButton(page)).toBeVisible();
  });

  test("Falls back to the generic error when the rejection has no message", async ({
    mount,
    page,
  }) => {
    // 1. onSend rejects with something that is not an Error.
    await mount(<TestGenericSupportForm sendOutcome="reject" />);
    await openForm(page);
    await fillMessage(page);
    await sendButton(page).click();

    // 2. The generic error label is shown instead.
    await expect(page.getByRole("alert")).toHaveText(
      "Something went wrong. Please try again later.",
    );
  });

  test("Cancel waits for the send in progress", async ({ mount, page }) => {
    // 1. Send a message; onSend takes 1 s to resolve.
    await mount(<TestGenericSupportForm sendDelayMs={1000} />);
    await openForm(page);
    await fillMessage(page);
    await sendButton(page).click();
    await expect(page.getByRole("button", { name: "Sending…" })).toBeVisible();

    // 2. Cancel is unavailable while sending: the request can't be taken
    //    back, so the form must not pretend it was cancelled.
    const cancelButton = page.getByRole("button", { name: "Cancel" });
    await expect(cancelButton).toHaveAttribute("aria-disabled", "true");
    // force: Playwright refuses to click an aria-disabled button by default,
    // and we want to prove the click is ignored.
    await cancelButton.click({ force: true });
    await expect(page.getByRole("dialog")).toBeVisible();

    // 3. The send completes normally and onCancel never ran.
    await expect(
      page.getByRole("heading", { name: "Thank you for your feedback" }),
    ).toBeVisible();
    expect(await getCalls(page)).not.toContainEqual({ type: "cancel" });
  });

  test("Closing the success view with Escape calls onSuccessClose", async ({
    mount,
    page,
  }) => {
    // 1. Send a message and wait for the success view.
    await mount(<TestGenericSupportForm />);
    await openForm(page);
    await fillMessage(page);
    await sendButton(page).click();
    await expect(
      page.getByRole("heading", { name: "Thank you for your feedback" }),
    ).toBeVisible();

    // 2. Escape closes it like the Close button: the message was sent, so it
    //    reports a closed success view, not a cancelled draft.
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const calls = await getCalls(page);
    expect(calls).toContainEqual({ type: "successClose" });
    expect(calls).not.toContainEqual({ type: "cancel" });
  });

  test("Keeps the draft when dismissed and clears it on Cancel", async ({
    mount,
    page,
  }) => {
    // 1. Start a message, then dismiss the form with Escape.
    await mount(<TestGenericSupportForm />);
    await openForm(page);
    await subjectField(page).fill("Half-written subject");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);

    // 2. Reopening shows the draft: an accidental close loses nothing.
    await openForm(page);
    await expect(subjectField(page)).toHaveValue("Half-written subject");

    // 3. Cancel discards the draft.
    await page.getByRole("button", { name: "Cancel" }).click();
    await openForm(page);
    await expect(subjectField(page)).toHaveValue("");
  });
});

test.describe("GenericSupportForm - attachments", () => {
  test("Explains why a file is refused", async ({ mount, page }) => {
    // 1. One png of 1 KB at most is allowed.
    await mount(
      <TestGenericSupportForm
        maxFiles={1}
        maxFileSize={1024}
        acceptedFileTypes={["image/png"]}
        uploadHint="One png image, up to 1 KB"
      />,
    );
    await openForm(page);
    await expect(page.getByText("One png image, up to 1 KB")).toBeVisible();
    const fileInput = page.locator('input[type="file"]');

    // 2. A file of another type is refused.
    await fileInput.setInputFiles({
      name: "report.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF"),
    });
    await expect(page.getByRole("alert")).toHaveText(
      "This file type is not allowed.",
    );

    // 3. A file over the size limit is refused, and the limit is shown.
    await fileInput.setInputFiles({
      name: "big.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(2048),
    });
    await expect(page.getByRole("alert")).toContainText(
      "The file is too large. Maximum size: 1",
    );

    // 4. A valid file is added as a chip, with a named remove button.
    await fileInput.setInputFiles({
      name: "shot.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(10),
    });
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Remove shot.png" }),
    ).toBeVisible();

    // 5. A second file goes over maxFiles.
    await fileInput.setInputFiles({
      name: "other.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(10),
    });
    await expect(page.getByRole("alert")).toHaveText(
      "Maximum number of files: 1.",
    );
  });
});
