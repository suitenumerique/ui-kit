import { getLocales } from ":/locales/Locale";
import { CunninghamProvider as OriginalProvider } from "@openfun/cunningham-react";

export const CunninghamProvider = (
  props: Parameters<typeof OriginalProvider>[0]
) => {
  const locales = getLocales();
  return <OriginalProvider theme="dsfr" customLocales={locales} {...props} />;
};
