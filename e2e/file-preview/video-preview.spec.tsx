import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { videoFile } from "../helpers/fixtures";

test.describe("Video Preview", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TestFilePreview files={[videoFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Renders the VideoPlayer inside the video wrapper", async ({
    page,
  }) => {
    const wrapper = page.locator(".video-preview-viewer-container");
    await expect(wrapper).toBeVisible();

    const videoPlayer = wrapper.locator(".video-player");
    await expect(videoPlayer).toBeVisible();

    const video = videoPlayer.locator("video.video-player__video");
    await expect(video).toBeAttached();

    const src = await video.getAttribute("src");
    expect(src).toBeTruthy();
    expect(src).toMatch(/chantier/);
  });

  test("Shows custom controls (not native) when the video is loaded", async ({
    page,
  }) => {
    const video = page.locator("video.video-player__video");
    await expect(video).toBeAttached();

    const hasNativeControls = await video.evaluate(
      (el) => (el as HTMLVideoElement).controls,
    );
    expect(hasNativeControls).toBe(false);

    await expect(page.locator(".video-player__controls")).toBeVisible({
      timeout: 5000,
    });
  });

  test("Hides the actions menu for video files", async ({ page }) => {
    const filePreview = page.getByTestId("file-preview");
    await expect(filePreview.getByText("more_vert")).not.toBeVisible();
  });
});
