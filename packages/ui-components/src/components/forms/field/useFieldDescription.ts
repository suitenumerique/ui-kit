import { useId } from "react";

export type UseFieldDescriptionParams = {
  /**
   * Id of the described control. The description ids derive from it. When
   * omitted, an id is generated: give it to the control.
   */
  id?: string;
  /** The `text` given to `Field` (e.g. an error message). */
  text?: string;
  /** The secondary text rendered under the label. */
  labelDescription?: string;
  /** `aria-describedby` set by the consumer or by a library (downshift…). */
  ariaDescribedBy?: string;
};

export type UseFieldDescriptionReturn = {
  /** The given id, or the generated one. */
  id: string;
  /** Id to give to the label description element, when there is one. */
  descriptionId: string | undefined;
  /** Id to give to `Field` as `textId`, when there is a text. */
  textId: string | undefined;
  /** `aria-describedby` of the control, undefined when nothing describes it. */
  describedBy: string | undefined;
};

/**
 * Links a form control to the texts that describe it: the label description
 * and the message `Field` renders under it (e.g. an error), so that screen
 * readers read them with the control (RGAA 11.10).
 *
 * Usage: put `describedBy` on the focusable element and pass `textId` to
 * `Field`.
 */
export const useFieldDescription = ({
  id,
  text,
  labelDescription,
  ariaDescribedBy,
}: UseFieldDescriptionParams): UseFieldDescriptionReturn => {
  const generatedId = useId();
  const idToUse = id || generatedId;
  let descriptionId: string | undefined;
  if (labelDescription) {
    descriptionId = `${idToUse}-description`;
  }
  let textId: string | undefined;
  if (text) {
    textId = `${idToUse}-text`;
  }
  const describedBy =
    [ariaDescribedBy, descriptionId, textId].filter(Boolean).join(" ") ||
    undefined;
  return { id: idToUse, descriptionId, textId, describedBy };
};
