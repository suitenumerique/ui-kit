import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { imageFile } from "../helpers/fixtures";
import type { FilePreviewType } from "../../src/components/preview/types";

// A known file extension must not turn a folder's name or icon into a file's.
const folder: FilePreviewType = {
  id: "denied-folder",
  title: "Top.secret.pdf",
  size: 0,
  mimetype: "",
  url: "",
  url_preview: "",
  isFolderAccessDenied: true,
};

const folderMiniSvg = readFileSync(
  new URL("../../src/assets/files/icons/mime-folder-mini.svg", import.meta.url),
  "utf8",
);

const deniedState = ".file-preview-no-access";

test("Uses the mini folder asset in the header and preserves the dotted name", async ({
  mount,
  page,
}) => {
  await mount(<TestFilePreview files={[folder]} />);

  await expect(page.locator(".file-preview__title")).toHaveText(folder.title);
  await expect(
    page.locator(`${deniedState} .preview-message__title`),
  ).toHaveText(folder.title);
  await expect(page).toHaveTitle(folder.title);

  const icon = page.locator(".file-preview__title-wrapper img");
  await expect(icon).toBeVisible();
  // Compare SVG geometry, so this works with both inlined assets and hashed URLs.
  const paths = await icon.evaluate(async (image: HTMLImageElement) => {
    const svg = await (await fetch(image.src)).text();
    const document = new DOMParser().parseFromString(svg, "image/svg+xml");
    return [...document.querySelectorAll("path")].map((path) =>
      path.getAttribute("d"),
    );
  });
  expect(paths).toEqual(
    [...folderMiniSvg.matchAll(/<path d="([^"]+)"/g)].map((match) => match[1]),
  );
  await expect(page.locator(`${deniedState} img`)).toBeVisible();
});

test("Requests access for the current folder without closing, including after navigation", async ({
  mount,
  page,
}) => {
  const secondFolder = {
    ...folder,
    id: "second-folder",
    title: "Other.folder",
  };
  const requested: FilePreviewType[] = [];
  let closeCalls = 0;
  await mount(
    <TestFilePreview
      files={[imageFile, folder, secondFolder]}
      onRequestAccess={(file) => {
        requested.push(file);
      }}
      onClose={() => {
        closeCalls++;
      }}
    />,
  );

  await expect(page.locator(".image-viewer")).toBeVisible();
  const next = page.locator(".file-preview__next-button button");
  const previous = page.locator(".file-preview__previous-button button");
  await next.click();
  await expect(page.locator(deniedState)).toBeVisible();
  await expect(page.locator(".image-viewer")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Request access", exact: true })
    .click();
  await expect
    .poll(() => requested.map((file) => file.id))
    .toEqual([folder.id]);
  expect(requested[0]).toMatchObject(folder);
  await expect(page.getByTestId("file-preview")).toBeVisible();

  await next.click();
  await expect(page.locator(".file-preview__title")).toHaveText(
    secondFolder.title,
  );
  await page
    .getByRole("button", { name: "Request access", exact: true })
    .click();
  await expect
    .poll(() => requested.map((file) => file.id))
    .toEqual([folder.id, secondFolder.id]);
  expect(requested[1]).toMatchObject(secondFolder);
  expect(closeCalls).toBe(0);
  await expect(next).toBeDisabled();

  await previous.click();
  await expect(page.locator(".file-preview__title")).toHaveText(folder.title);
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".image-viewer")).toBeVisible();
  await expect(page.locator(deniedState)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Request access", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(deniedState)).toBeVisible();
});

test("Hides Request access when no handler is supplied", async ({
  mount,
  page,
}) => {
  await mount(<TestFilePreview files={[folder]} />);
  await expect(page.locator(deniedState)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Request access", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(deniedState).getByRole("button")).toHaveText(
    "Close",
  );
});

for (const dismissal of ["header", "message", "Escape"] as const) {
  test(`Calls onClose via ${dismissal} without requesting access`, async ({
    mount,
    page,
  }) => {
    let closeCalls = 0;
    let requestCalls = 0;
    await mount(
      <TestFilePreview
        files={[folder]}
        onClose={() => {
          closeCalls++;
        }}
        onRequestAccess={() => {
          requestCalls++;
        }}
      />,
    );
    await expect(page.locator(deniedState)).toBeVisible();
    if (dismissal === "Escape") {
      await page.keyboard.press("Escape");
    } else if (dismissal === "header") {
      await page.locator(".file-preview__header__content__left button").click();
    } else {
      await page
        .locator(deniedState)
        .getByRole("button", { name: "Close", exact: true })
        .click();
    }
    // FilePreview is controlled: the consuming app owns closing after this call.
    await expect.poll(() => closeCalls).toBe(1);
    expect(requestCalls).toBe(0);
  });
}

test("hideCloseButton hides both close buttons while keeping Escape available", async ({
  mount,
  page,
}) => {
  let closeCalls = 0;
  await mount(
    <TestFilePreview
      files={[folder]}
      hideCloseButton
      onClose={() => {
        closeCalls++;
      }}
      onRequestAccess={() => {}}
    />,
  );
  await expect(page.locator(deniedState)).toBeVisible();
  await expect(
    page.locator(".file-preview__header__content__left button"),
  ).toHaveCount(0);
  await expect(
    page
      .locator(deniedState)
      .getByRole("button", { name: "Close", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Request access", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect.poll(() => closeCalls).toBe(1);
});

const viewerCases: { name: string; fields: Partial<FilePreviewType> }[] = [
  { name: "image", fields: { mimetype: "image/jpeg" } },
  { name: "video", fields: { mimetype: "video/mp4" } },
  { name: "audio", fields: { mimetype: "audio/mpeg" } },
  { name: "PDF", fields: { mimetype: "application/pdf" } },
  { name: "suspicious file", fields: { isSuspicious: true } },
  { name: "editor", fields: { is_wopi_supported: true } },
];

for (const { name, fields } of viewerCases) {
  test(`Denied access takes priority over the ${name} viewer and never requests content`, async ({
    mount,
    page,
  }) => {
    const requests: string[] = [];
    await page.route("**/denied-folder-content/**", async (route) => {
      requests.push(route.request().url());
      await route.fulfill({ status: 200, body: "Content must not be loaded" });
    });
    // Sentinel URLs deliberately catch accidental viewer mounts even if a
    // consumer supplies stale file metadata on an inaccessible folder.
    const inaccessible = {
      ...folder,
      ...fields,
      url: "/denied-folder-content/original",
      url_preview: "/denied-folder-content/preview",
    };
    await mount(
      <TestFilePreview files={[inaccessible]} onOpenInEditor={() => {}} />,
    );
    await expect(page.locator(deniedState)).toBeVisible();
    await expect(
      page.locator(
        ".image-viewer, .video-player, .audio-player, .react-pdf__Document, video, audio, canvas, iframe, object, embed",
      ),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Open in editor", exact: true }),
    ).toHaveCount(0);
    await page.waitForLoadState("networkidle");
    expect(requests).toEqual([]);
  });
}

test("Preserves custom header actions and the sidebar without adding Share or Print", async ({
  mount,
  page,
}) => {
  let downloads = 0;
  await mount(
    <TestFilePreview
      files={[folder]}
      customHeaderActionsMode="wrap"
      handleDownloadFile={() => {
        downloads++;
      }}
    />,
  );
  await expect(page.locator(deniedState)).toBeVisible();
  await expect(page.getByTestId("custom-before")).toBeVisible();
  await expect(page.getByTestId("custom-after")).toBeVisible();
  await page
    .getByRole("button", { name: "file_download", exact: true })
    .click();
  await expect.poll(() => downloads).toBe(1);
  await expect(
    page.getByRole("button", { name: /^(Share|Print|more_horiz)$/ }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "info_outline", exact: true }).click();
  await expect(page.locator(".file-preview-sidebar")).toHaveClass(
    /(^|\s)open(\s|$)/,
  );
  await expect(page.locator(deniedState)).toBeVisible();
});

const translations = [
  {
    locale: "en-US",
    close: "Close",
    request: "Request access",
    description:
      "You do not have the necessary permissions to open this folder.",
  },
  {
    locale: "fr-FR",
    close: "Fermer",
    request: "Demander l’accès",
    description:
      "Vous n’avez pas les autorisations nécessaires pour ouvrir ce dossier.",
  },
  {
    locale: "nl-NL",
    close: "Sluiten",
    request: "Toegang aanvragen",
    description: "Je hebt niet de benodigde rechten om deze map te openen.",
  },
  {
    locale: "de-DE",
    close: "Schließen",
    request: "Zugriff anfordern",
    description:
      "Sie haben nicht die erforderlichen Berechtigungen, um diesen Ordner zu öffnen.",
  },
  {
    locale: "es-ES",
    close: "Cerrar",
    request: "Solicitar acceso",
    description: "No tienes los permisos necesarios para abrir esta carpeta.",
  },
];

for (const { locale, close, request, description } of translations) {
  test(`Long folder names and ${locale} actions fit a narrow screen`, async ({
    mount,
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    const longName =
      "Top.secret.Project.documentation.and.confidential.archives.pdf";
    await mount(
      <TestFilePreview
        files={[{ ...folder, title: longName }]}
        currentLocale={locale}
        onRequestAccess={() => {}}
      />,
    );
    const state = page.locator(deniedState);
    const title = state.locator(".preview-message__title");
    await expect(title).toHaveText(longName);
    await expect(page.locator(".file-preview__title")).toHaveText(longName);
    await expect(state.locator(".preview-message__description")).toHaveText(
      description,
    );
    await expect(
      state.getByRole("button", { name: close, exact: true }),
    ).toBeInViewport();
    await expect(
      state.getByRole("button", { name: request, exact: true }),
    ).toBeInViewport();
    expect(
      await title.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}
