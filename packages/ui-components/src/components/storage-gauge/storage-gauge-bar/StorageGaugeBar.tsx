import clsx from "clsx";

export type StorageGaugeBarProps = {
  used: number;
  total: number;
  "aria-label"?: string;
};

export const StorageGaugeBar = ({
  used,
  total,
  "aria-label": ariaLabel,
}: StorageGaugeBarProps) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <div
      className="c__storage-gauge__bar"
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(used, total)}
    >
      <div
        className={clsx("c__storage-gauge__bar__fill", {
          "c__storage-gauge__bar__fill--warning":
            percentage >= 80 && percentage < 100,
          "c__storage-gauge__bar__fill--error": percentage >= 100,
        })}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
