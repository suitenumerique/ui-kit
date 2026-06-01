import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import { useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { Icon } from ":/components/icon";
import {
  DEFAULT_FULL_THRESHOLD,
  DEFAULT_WARNING_THRESHOLD,
  formatStorageNumber,
  getStorageGaugePercentage,
  getStorageGaugeStatus,
} from "./utils";

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
  /** Display a trailing arrow hinting that the gauge opens more details */
  showArrow?: boolean;
  /** Usage ratio (0-1) at which the warning color kicks in (default: 0.9) */
  warningThreshold?: number;
  /** Usage ratio (0-1) at which the full/error color kicks in (default: 1) */
  fullThreshold?: number;
};

export const StorageGauge = ({
  used,
  total,
  unit = "Go",
  compact = false,
  precision = 2,
  showArrow = false,
  warningThreshold = DEFAULT_WARNING_THRESHOLD,
  fullThreshold = DEFAULT_FULL_THRESHOLD,
  className,
  ...props
}: StorageGaugeProps) => {
  const { currentLocale } = useCunningham();

  const percentage = getStorageGaugePercentage(used, total);
  const status = getStorageGaugeStatus(
    used,
    total,
    warningThreshold,
    fullThreshold,
  );
  const formattedUsed = formatStorageNumber(used, currentLocale, precision);
  const formattedTotal = Number.isInteger(total)
    ? total.toLocaleString(currentLocale)
    : formatStorageNumber(total, currentLocale, precision);

  return (
    <button
      type="button"
      className={clsx("c__storage-gauge", className, {
        "c__storage-gauge--compact": compact,
        [`c__storage-gauge--${status}`]: status !== "default",
      })}
      {...props}
    >
      {!compact && (
        <div className="c__storage-gauge__bar">
          <div
            className="c__storage-gauge__bar__fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      <span className="c__storage-gauge__value">
        <span className="c__storage-gauge__label">
          {formattedUsed}&nbsp;/&nbsp;{formattedTotal}&nbsp;{unit}
        </span>
        {showArrow && (
          <Icon
            name="north_east"
            size={16}
            className="c__storage-gauge__arrow"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
};
