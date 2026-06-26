import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestHelpMenu } from "../helpers/mount-help-menu";

const legalAll = {
  personalDataUrl: "https://example.com/personal-data",
  termsOfUse: "https://example.com/terms",
  accessibilityUrl: "https://example.com/accessibility",
  legalNoticeUrl: "https://example.com/legal-notice",
};

/** Open the help menu via its trigger button. */
const openMenu = async (page: Page, name = "Help") => {
  await page.getByRole("button", { name }).click();
};

/** Read the callbacks recorded by the in-browser mount helper. */
const getCalls = (page: Page) =>
  page.evaluate(() => window.__helpMenuCalls ?? []);

test.describe("HelpMenu - rendering", () => {
  test("Renders nothing when no options are provided", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu />);
    await expect(page.getByRole("button", { name: "Help" })).toHaveCount(0);
  });

  test("Renders the trigger button when at least one option is provided", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu documentationUrl="https://example.com/docs" />);
    await expect(page.getByRole("button", { name: "Help" })).toBeVisible();
  });

  test("Opens the menu and shows the configured items", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHelpMenu
        documentationUrl="https://example.com/docs"
        withOnboarding
        withContactUs
      />,
    );

    await openMenu(page);

    await expect(
      page.getByRole("menuitem", { name: "Documentation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Onboarding" }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Contact us" }),
    ).toBeVisible();
  });

  test("Orders the sections: documentation, onboarding, legal, custom, contact us, release", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHelpMenu
        documentationUrl="https://example.com/docs"
        withOnboarding
        legal={legalAll}
        customOptions={[{ label: "Keyboard shortcuts", testId: "custom-kbd" }]}
        withContactUs
        release={{ version: "4.3.0" }}
      />,
    );

    await openMenu(page);

    // Legal children stay collapsed until the submenu is opened, so the
    // top-level menuitems are exactly the six sections in order.
    const items = page.getByRole("menuitem");
    await expect(items).toHaveCount(6);
    await expect(items.nth(0)).toHaveText(/Documentation/);
    await expect(items.nth(1)).toHaveText(/Onboarding/);
    await expect(items.nth(2)).toHaveText(/Legal/);
    await expect(items.nth(3)).toHaveText(/Keyboard shortcuts/);
    await expect(items.nth(4)).toHaveText(/Contact us/);
    await expect(items.nth(5)).toHaveText(/Latest release/);
  });
});

test.describe("HelpMenu - documentation", () => {
  test("Opens the documentation URL in a new tab", async ({
    mount,
    page,
    context,
  }) => {
    await mount(<TestHelpMenu documentationUrl="https://example.com/docs" />);
    await openMenu(page);

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("menuitem", { name: "Documentation" }).click(),
    ]);

    expect(newPage.url()).toContain("/docs");
    await newPage.close();
  });
});

test.describe("HelpMenu - onboarding", () => {
  test("Fires the onboarding callback when clicked", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu withOnboarding />);
    await openMenu(page);

    await page.getByRole("menuitem", { name: "Onboarding" }).click();

    await expect(async () => {
      expect(await getCalls(page)).toContain("onboarding");
    }).toPass({ timeout: 5000 });
  });
});

test.describe("HelpMenu - legal submenu", () => {
  test("Does not render the legal option when legal is undefined", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu documentationUrl="https://example.com/docs" />);
    await openMenu(page);

    await expect(page.getByRole("menuitem", { name: "Legal" })).toHaveCount(0);
  });

  test("Does not render the legal option when all legal keys are empty", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHelpMenu documentationUrl="https://example.com/docs" legal={{}} />,
    );
    await openMenu(page);

    await expect(page.getByRole("menuitem", { name: "Legal" })).toHaveCount(0);
  });

  test("Renders the legal submenu with only the defined links", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHelpMenu
        legal={{
          personalDataUrl: "https://example.com/personal-data",
          legalNoticeUrl: "https://example.com/legal-notice",
        }}
      />,
    );
    await openMenu(page);

    const legalItem = page.getByRole("menuitem", { name: "Legal" });
    await expect(legalItem).toBeVisible();
    await legalItem.hover();

    await expect(
      page.getByRole("menuitem", { name: "Personal data" }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Legal notice" }),
    ).toBeVisible();
    // Undefined keys produce no entries.
    await expect(
      page.getByRole("menuitem", { name: "Terms of use" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("menuitem", { name: "Accessibility" }),
    ).toHaveCount(0);
  });

  test("Lists every legal link in order when all are defined", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu legal={legalAll} />);
    await openMenu(page);

    await page.getByRole("menuitem", { name: "Legal" }).hover();

    await expect(
      page.getByRole("menuitem", { name: "Personal data" }),
    ).toBeVisible();

    // Within the submenu popover, the four links keep the prop order.
    const submenu = page.getByRole("menu").last();
    const links = submenu.getByRole("menuitem");
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toHaveText(/Personal data/);
    await expect(links.nth(1)).toHaveText(/Terms of use/);
    await expect(links.nth(2)).toHaveText(/Accessibility/);
    await expect(links.nth(3)).toHaveText(/Legal notice/);
  });

  test("Opens a legal link in a new tab", async ({ mount, page, context }) => {
    await mount(<TestHelpMenu legal={legalAll} />);
    await openMenu(page);

    await page.getByRole("menuitem", { name: "Legal" }).hover();
    const personalData = page.getByRole("menuitem", { name: "Personal data" });
    await expect(personalData).toBeVisible();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      personalData.click(),
    ]);

    expect(newPage.url()).toContain("/personal-data");
    await newPage.close();
  });

  test("Marks legal links as opening in a new window for assistive tech", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu legal={legalAll} />);
    await openMenu(page);

    await page.getByRole("menuitem", { name: "Legal" }).hover();

    await expect(
      page.getByRole("menuitem", { name: "Personal data (new window)" }),
    ).toBeVisible();
  });
});

test.describe("HelpMenu - custom options", () => {
  test("Renders custom options between legal and contact us", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHelpMenu
        legal={legalAll}
        customOptions={[
          { label: "Keyboard shortcuts", testId: "custom-kbd" },
          { label: "What's new", url: "https://example.com/changelog" },
        ]}
        withContactUs
      />,
    );
    await openMenu(page);

    const items = page.getByRole("menuitem");
    await expect(items).toHaveCount(4);
    await expect(items.nth(0)).toHaveText(/Legal/);
    await expect(items.nth(1)).toHaveText(/Keyboard shortcuts/);
    await expect(items.nth(2)).toHaveText(/What's new/);
    await expect(items.nth(3)).toHaveText(/Contact us/);
  });

  test("Fires a custom option callback when clicked", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHelpMenu
        customOptions={[{ label: "Keyboard shortcuts", testId: "custom-kbd" }]}
      />,
    );
    await openMenu(page);

    await page.getByRole("menuitem", { name: "Keyboard shortcuts" }).click();

    await expect(async () => {
      expect(await getCalls(page)).toContain("custom:Keyboard shortcuts");
    }).toPass({ timeout: 5000 });
  });

  test("Opens a custom option link in a new tab", async ({
    mount,
    page,
    context,
  }) => {
    await mount(
      <TestHelpMenu
        customOptions={[
          { label: "What's new", url: "https://example.com/changelog" },
        ]}
      />,
    );
    await openMenu(page);

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("menuitem", { name: "What's new" }).click(),
    ]);

    expect(newPage.url()).toContain("/changelog");
    await newPage.close();
  });
});

test.describe("HelpMenu - contact us", () => {
  test("Fires the onContactUs callback when no feedback form is configured", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu withContactUs />);
    await openMenu(page);

    await page.getByRole("menuitem", { name: "Contact us" }).click();

    await expect(async () => {
      expect(await getCalls(page)).toContain("contactUs");
    }).toPass({ timeout: 5000 });
  });

  test("Opens the feedback form instead of firing onContactUs when configured", async ({
    mount,
    page,
  }) => {
    await mount(<TestHelpMenu withContactUs withFeedbackForm />);
    await openMenu(page);

    await page.getByRole("menuitem", { name: "Contact us" }).click();

    await expect(page.getByText("Contact the team")).toBeVisible();
    expect(await getCalls(page)).not.toContain("contactUs");
  });
});

test.describe("HelpMenu - release", () => {
  test("Shows the version and date as subtext", async ({ mount, page }) => {
    await mount(
      <TestHelpMenu release={{ version: "4.3.0", date: "Yesterday" }} />,
    );
    await openMenu(page);

    const releaseItem = page.getByRole("menuitem", { name: "Latest release" });
    await expect(releaseItem).toBeVisible();
    await expect(releaseItem).toContainText("4.3.0");
    await expect(releaseItem).toContainText("Yesterday");
  });

  test("Opens the release URL in a new tab when provided", async ({
    mount,
    page,
    context,
  }) => {
    await mount(
      <TestHelpMenu
        release={{
          version: "4.3.0",
          url: "https://example.com/releases/4.3.0",
        }}
      />,
    );
    await openMenu(page);

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("menuitem", { name: "Latest release" }).click(),
    ]);

    expect(newPage.url()).toContain("/releases/4.3.0");
    await newPage.close();
  });
});

test.describe("HelpMenu - i18n", () => {
  test("Translates the trigger and menu items for the active locale", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHelpMenu
        locale="fr-FR"
        documentationUrl="https://example.com/docs"
        withOnboarding
        legal={legalAll}
      />,
    );

    // The trigger aria-label is localised.
    const trigger = page.getByRole("button", { name: "Aide" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    await expect(
      page.getByRole("menuitem", { name: "Prise en main" }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Informations légales" }),
    ).toBeVisible();
  });
});
