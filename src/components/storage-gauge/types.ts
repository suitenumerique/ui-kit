import { ButtonHTMLAttributes } from "react";

export type StorageGaugeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Storage used (in the given unit) */
  used: number;
  /** Total storage available (in the given unit) */
  total: number;
  /** Unit label displayed after the values (default: "Go") */
  unit?: string;
  /** Compact mode: hides the gauge bar, shows only the text */
  compact?: boolean;
  /** Number of decimal places for the used value (default: 2) */
  precision?: number;
  /** Whether the gauge is locked */
  locked?: boolean;
  /** Content displayed when the gauge is locked */
  lockedContent?: React.ReactNode;
};
