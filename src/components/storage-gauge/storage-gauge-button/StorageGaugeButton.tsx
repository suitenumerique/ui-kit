import { Warning } from ":/icons";
import { StorageGaugeProps } from "../types";
import { IconSize } from ":/components/icon";
import { StorageGaugeBar } from "../storage-gauge-bar/StorageGaugeBar";
import clsx from "clsx";
import { useStorageGauge } from "../hooks";

export const StorageGaugeButton = ({
  used,
  total,
  unit = "Go",
  compact = false,
  precision = 2,
  locked = false,
  lockedContent,
  className,
  ...props
}: StorageGaugeProps) => {
  const { formattedUsed, formattedTotal } = useStorageGauge({
    used,
    total,
    precision,
  });

  return (
    <button
      type="button"
      className={clsx("c__storage-gauge", className, {
        "c__storage-gauge--compact": compact,
        "c__storage-gauge--locked": locked,
      })}
      {...props}
    >
      {locked && (
        <div className="c__storage-gauge__locked">
          {lockedContent ?? <Warning size={IconSize.SMALL} />}
        </div>
      )}
      {!locked && (
        <>
          {!compact && <StorageGaugeBar used={used} total={total} />}
          <span className="c__storage-gauge__label">
            {formattedUsed}&nbsp;/&nbsp;{formattedTotal}&nbsp;{unit}
          </span>
        </>
      )}
    </button>
  );
};
