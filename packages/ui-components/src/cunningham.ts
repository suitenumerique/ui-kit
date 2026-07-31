import { PartialExtendableNested, PartialNested } from ":/types";
import { tokens } from "./cunningham-tokens";

export * from "./components/alert";
export * from "./components/button";
export * from "./components/data-grid";
export * from "./components/data-grid/DataList";
export * from "./components/data-grid/SimpleDataGrid";
export * from "./components/forms/checkbox";
export * from "./components/forms/date-picker";
export * from "./components/forms/field";
export * from "./components/forms/input";
export * from "./components/forms/input/InputPassword";
export * from "./components/forms/labelled-box";
export * from "./components/forms/radio";
export * from "./components/forms/select";
export * from "./components/forms/switch";
export * from "./components/forms/text-area";
export type { FieldVariant } from "./components/forms/types";
export * from "./components/calendar";
export * from "./components/loader";
export * from "./components/modal";
export * from "./components/modal/ConfirmationModal";
export * from "./components/modal/DeleteConfirmationModal";
export * from "./components/modal/MessageModal";
export * from "./components/modal/ModalProvider";
export * from "./components/pagination";
export * from "./components/popover";
export {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  SUPPORTED_LOCALES,
  useCunningham,
} from "./components/provider";
export { Locales } from "./components/provider/Locales";
export * from "./components/toast";
export * from "./components/toast/ToastProvider";
export * from "./components/tooltip";
export * from "./utils/VariantUtils";

export type DefaultTokens = PartialNested<typeof tokens.themes.default>;
export const defaultTokens = tokens.themes.default;
export type Configuration = {
  themes: Record<string, PartialExtendableNested<typeof tokens.themes.default>>;
};

export { default as enUS } from "./locales/en-US.json";
export { default as frFR } from "./locales/fr-FR.json";
