import { useMemo } from "react";
import { useCunningham } from ":/components/provider";
import { GenericSupportFormLabels } from "./types";

// Labels that have a default translation under `components.genericSupportForm`.
// `uploadHint` is left out on purpose: it depends on the app's file rules.
const TRANSLATED_LABELS = [
  "title",
  "subtitle",
  "subject",
  "subjectPlaceholder",
  "subjectRequired",
  "message",
  "messagePlaceholder",
  "messageRequired",
  "uploadFile",
  "removeFile",
  "fileTooLarge",
  "fileTypeInvalid",
  "fileTooMany",
  "emailCheckbox",
  "emailLabel",
  "emailPrivacy",
  "emailRequired",
  "emailError",
  "cancel",
  "send",
  "sending",
  "category",
  "error",
  "successTitle",
  "successText",
  "successClose",
] as const satisfies readonly (keyof GenericSupportFormLabels)[];

/** The form's labels: the app's overrides, else the translations. */
export const useSupportFormLabels = (
  overrides?: Partial<GenericSupportFormLabels>,
) => {
  const { t } = useCunningham();
  return useMemo<GenericSupportFormLabels>(() => {
    const resolved = {
      uploadHint: overrides?.uploadHint,
    } as GenericSupportFormLabels;
    for (const key of TRANSLATED_LABELS) {
      resolved[key] =
        overrides?.[key] ?? t(`components.genericSupportForm.${key}`);
    }
    return resolved;
  }, [overrides, t]);
};
