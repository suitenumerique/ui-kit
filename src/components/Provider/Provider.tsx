import { locales } from ":/locales/Locale";
import { CunninghamProvider as OriginalProvider } from "@gouvfr-lasuite/cunningham-react";

export const CunninghamProvider = (
  props: Parameters<typeof OriginalProvider>[0]
) => {
  return <OriginalProvider customLocales={locales} {...props} />;
};
