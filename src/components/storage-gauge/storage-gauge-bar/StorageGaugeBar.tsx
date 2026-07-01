import { CSSProperties } from "react";

export type StorageGaugeBarProps = {
  used: number;
  total: number;
};

export const StorageGaugeBar = ({ used, total }: StorageGaugeBarProps) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const fillColor =
    percentage >= 100
      ? "var(--c--contextuals--content--semantic--error--secondary)"
      : percentage >= 80
      ? "var(--c--contextuals--content--semantic--warning--secondary)"
      : "var(--c--contextuals--content--semantic--neutral--secondary)";

  return (
    <div className="c__storage-gauge__bar">
      <div
        className="c__storage-gauge__bar__fill"
        style={
          {
            width: `${percentage}%`,
            "--c--storage-gauge-fill-color": fillColor,
          } as CSSProperties
        }
      />
    </div>
  );
};
