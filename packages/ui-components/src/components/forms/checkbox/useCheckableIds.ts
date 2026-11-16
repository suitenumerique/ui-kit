import { ReactNode } from "react";
import { useFieldDescription } from ":/components/forms/field/useFieldDescription";

type Params = {
  label?: ReactNode;
  text?: string;
  inputProps: {
    id?: string;
    "aria-describedby"?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
  };
};

/**
 * Ids of Checkbox, Radio and Switch. Their <label> wraps the whole Field, so
 * the message under the control (e.g. an error) is part of the label text.
 * The control is named after its label only, and described by the message,
 * or screen readers would read the message twice.
 */
export const useCheckableIds = ({ label, text, inputProps }: Params) => {
  const { id, textId, describedBy } = useFieldDescription({
    id: inputProps.id,
    text,
    ariaDescribedBy: inputProps["aria-describedby"],
  });
  let labelId: string | undefined;
  if (label) {
    labelId = `${id}-label`;
  }
  const labelledBy = getLabelledBy(inputProps, labelId);
  return { id, textId, describedBy, labelId, labelledBy };
};

/** A name given by the consumer wins over the label. */
const getLabelledBy = (
  inputProps: Params["inputProps"],
  labelId: string | undefined,
) => {
  if (inputProps["aria-labelledby"]) {
    return inputProps["aria-labelledby"];
  }
  if (inputProps["aria-label"]) {
    return undefined;
  }
  return labelId;
};
