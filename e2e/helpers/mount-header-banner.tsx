import { CunninghamProvider } from "../../src/components/Provider/Provider";
import {
  HeaderBanner,
  HeaderBannerProps,
} from "../../src/components/header-banner/HeaderBanner";

/**
 * Playwright CT wrapper that renders the HeaderBanner inside the
 * CunninghamProvider so translations (close button label) resolve.
 */
export const TestHeaderBanner = (props: HeaderBannerProps) => {
  return (
    <CunninghamProvider currentLocale="en-US">
      <HeaderBanner {...props} />
    </CunninghamProvider>
  );
};
