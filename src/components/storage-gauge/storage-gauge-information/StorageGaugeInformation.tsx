import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { useStorageGauge } from "../hooks";
import { StorageGaugeBar } from "../storage-gauge-bar/StorageGaugeBar";
import { StorageGaugeProps } from "../types";
import { IconSize } from ":/components/icon";
import { ArrowUpRight } from ":/icons";

export const StorageGaugeInformation = ({
  used,
  total,
  unit = "Go",
  precision = 2,
  title,
  titleChildren,
  onMoreInfoClick,
  locked,
  labelChildren,
  label,
}: StorageGaugeProps & {
  titleChildren?: React.ReactNode;
  onMoreInfoClick?: () => void;
  title?: string;
  locked?: boolean;
  lockedContent?: React.ReactNode;
  labelChildren?: React.ReactNode;
  label?: string;
}) => {
  const { formattedUsed, formattedTotal } = useStorageGauge({
    used,
    total,
    precision,
  });
  const { t } = useCunningham();
  return (
    <div className="c__storage-gauge__information">
      <div className="c__storage-gauge__information__header">
        <div className="c__storage-gauge__information__header__left">
          <div className="c__storage-gauge__information__title">
            {title ?? t("components.storage-gauge.information.title")}
            {titleChildren}
          </div>
          <span className="c__storage-gauge__information__label">
            {label ??
              t("components.storage-gauge.information.usage", {
                used: formattedUsed,
                total: formattedTotal,
                unit,
              })}
            {labelChildren}
          </span>
        </div>
        {onMoreInfoClick && (
          <Button
            className="c__storage-gauge__information__more-info"
            onClick={onMoreInfoClick}
            color="neutral"
            variant="tertiary"
            size="small"
            icon={<ArrowUpRight size={IconSize.SMALL} />}
            iconPosition="right"
          >
            {t("components.storage-gauge.information.more-info")}
          </Button>
        )}
      </div>
      {locked ? (
        <StorageGaugeBar used={0} total={total} />
      ) : (
        <StorageGaugeBar used={used} total={total} />
      )}
    </div>
  );
};
