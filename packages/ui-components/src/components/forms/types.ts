/**
 * Field variant determines how the label and placeholder are displayed.
 * - "floating": Label serves as placeholder when empty, animates above value when focused/filled (default)
 * - "classic": Label is always above the field, placeholder is native HTML placeholder
 * - "inline": Label — and its optional labelDescription — sits in a left column, the
 *   field in a right column, on the same row. Placeholder is native HTML placeholder.
 */
export type FieldVariant = "floating" | "classic" | "inline";

/**
 * Variants usable by components that always stack the label above the control.
 * "inline" is excluded because those components have no left column to render it in.
 */
export type StackedFieldVariant = Exclude<FieldVariant, "inline">;
