import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { hevcVideoFile } from "../helpers/fixtures";

test.describe("HEVC Video Preview", () => {
  test("Renders the video player inside the video wrapper", async ({
    mount,
    page,
  }) => {
    await mount(<TestFilePreview files={[hevcVideoFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const wrapper = page.locator(".video-preview-viewer-container");
    await expect(wrapper).toBeVisible();
    await expect(wrapper.locator(".video-player")).toBeVisible();
  });

  test("Plays the HEVC video (transcoding if needed) or falls back to download", async ({
    mount,
    page,
  }) => {
    await mount(<TestFilePreview files={[hevcVideoFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    // Native-first, then a lazy-loaded WASM transcode — behaviour depends on
    // the browser (native HEVC on Safari, transcode on Chrome, download
    // fallback where WebCodecs H.264 isn't available). We assert it always
    // resolves to a usable state and never gets stuck on the spinner: either a
    // video with decoded frames, or the download fallback.
    await expect
      .poll(
        async () => {
          const fellBack = await page
            .getByText("not supported for preview")
            .isVisible()
            .catch(() => false);
          if (fellBack) return "fallback";

          const decoded = await page
            .locator("video.video-player__video")
            .evaluate((el) => (el as HTMLVideoElement).videoWidth > 0)
            .catch(() => false);
          return decoded ? "playing" : "pending";
        },
        { timeout: 45000, intervals: [500] }
      )
      .not.toBe("pending");
  });
});
