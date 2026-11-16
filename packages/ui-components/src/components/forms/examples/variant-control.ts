import type { Meta } from "@storybook/react";
import type {
  FieldVariant,
  StackedFieldVariant,
} from ":/components/forms/types";

export type VariantArgs = { variant: FieldVariant };

/**
 * Spread in the meta of a form example: adds a "variant" select to the
 * controls panel, so reviewers can switch every field of the form at once.
 */
export const variantControl = {
  args: { variant: "floating" },
  argTypes: {
    variant: {
      control: "select",
      options: ["floating", "classic", "inline"] satisfies FieldVariant[],
    },
  },
} satisfies Pick<Meta<VariantArgs>, "args" | "argTypes">;

/**
 * DatePicker and DateRangePicker always stack their label above the control:
 * "inline" falls back to the closest variant they support, "classic".
 */
export const stacked = (variant: FieldVariant): StackedFieldVariant => {
  if (variant === "inline") {
    return "classic";
  }
  return variant;
};
