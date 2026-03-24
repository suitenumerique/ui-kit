import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import { useCunningham } from "@gouvfr-lasuite/cunningham-react";

type StorageGaugeProps = Omit<
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
};

export const StorageGauge = ({
  used,
  total,
  unit = "Go",
  compact = false,
  precision = 2,
  className,
  ...props
}: StorageGaugeProps) => {
  const { currentLocale } = useCunningham();

  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const formatNumber = (value: number, decimals: number) =>
    value.toLocaleString(currentLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  const formattedUsed = formatNumber(used, precision);
  const formattedTotal = Number.isInteger(total)
    ? total.toLocaleString(currentLocale)
    : formatNumber(total, precision);

  return (
    <button
      type="button"
      className={clsx("c__storage-gauge", className, {
        "c__storage-gauge--compact": compact,
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
      <span className="c__storage-gauge__label">
        {formattedUsed}&nbsp;/&nbsp;{formattedTotal}&nbsp;{unit}
      </span>
    </button>
  );
};
