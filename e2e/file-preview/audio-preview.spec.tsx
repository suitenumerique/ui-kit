import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { audioFile } from "../helpers/fixtures";

test.describe("Audio Preview", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TestFilePreview files={[audioFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Renders the AudioPlayer with the file title and source", async ({
    page,
  }) => {
    const player = page.locator(".audio-player");
    await expect(player).toBeVisible();

    await expect(player.locator(".audio-player__title")).toHaveText(
      "nuissance_sonores.mp3",
    );

    const audio = player.locator("audio");
    await expect(audio).toBeAttached();

    const src = await audio.getAttribute("src");
    expect(src).toBeTruthy();
    expect(src).toMatch(/nuissance_sonores/);
  });

  test("Hides the actions menu for audio files", async ({ page }) => {
    const filePreview = page.getByTestId("file-preview");
    await expect(filePreview.getByText("more_vert")).not.toBeVisible();
  });
});
