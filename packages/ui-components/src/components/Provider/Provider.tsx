import { locales } from ":/locales/Locale";
import { CunninghamProvider as OriginalProvider } from "./index";

export const CunninghamProvider = (
  props: Parameters<typeof OriginalProvider>[0]
) => {
  return <OriginalProvider customLocales={locales} {...props} />;
};
