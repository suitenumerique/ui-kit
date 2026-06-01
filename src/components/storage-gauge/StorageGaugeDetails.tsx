import clsx from "clsx";
import { HTMLAttributeAnchorTarget, ReactNode } from "react";
import {
  Button,
  Tooltip,
  useCunningham,
} from "@gouvfr-lasuite/cunningham-react";
import { Icon } from ":/components/icon";
import {
  DEFAULT_FULL_THRESHOLD,
  DEFAULT_WARNING_THRESHOLD,
  formatStorageNumber,
  getStorageGaugePercentage,
  getStorageGaugeStatus,
} from "./utils";
import { Info } from ":/icons";

export type StorageGaugeDetailsAction = {
  label?: string;
  href?: string;
  onClick?: () => void;
  target?: HTMLAttributeAnchorTarget;
};

export type StorageGaugeDetailsProps = {
  /** Storage used (in the given unit) */
  used: number;
  /** Total storage available (in the given unit) */
  total: number;
  /** Unit label displayed after the values (default: "Go") */
  unit?: string;
  /** Number of decimal places for the used value (default: 2) */
  precision?: number;
  /** Heading. Defaults to a translated "Used storage". */
  title?: ReactNode;
  /** Description under the title. Defaults to a translated "{used} of {total} {unit} used". */
  description?: ReactNode;
  /** Tooltip content shown through an info icon next to the description. */
  info?: ReactNode;
  /** Optional "More info" action shown on the trailing side of the header. */
  action?: StorageGaugeDetailsAction;
  /** Usage ratio (0-1) at which the warning color kicks in (default: 0.9) */
  warningThreshold?: number;
  /** Usage ratio (0-1) at which the full/error color kicks in (default: 1) */
  fullThreshold?: number;
  className?: string;
};

/**
 * Detailed gauge presentation meant to be displayed inside a modal alongside
 * text and/or control components. Shows a title, a usage description with an
 * optional info tooltip, an optional "More info" action and a colored bar.
 */
export const StorageGaugeDetails = ({
  used,
  total,
  unit = "Go",
  precision = 2,
  title,
  description,
  info,
  action,
  warningThreshold = DEFAULT_WARNING_THRESHOLD,
  fullThreshold = DEFAULT_FULL_THRESHOLD,
  className,
}: StorageGaugeDetailsProps) => {
  const { t, currentLocale } = useCunningham();

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

  const resolvedDescription =
    description ??
    t("components.storageGauge.used", {
      used: formattedUsed,
      total: formattedTotal,
      unit,
    });

  const actionContent = action && (
    <>
      <span>{action.label ?? t("components.storageGauge.moreInfo")}</span>
      <Icon name="north_east" size={16} aria-hidden="true" />
    </>
  );

  return (
    <div
      className={clsx(
        "c__storage-gauge-details",
        `c__storage-gauge-details--${status}`,
        className,
      )}
    >
      <div className="c__storage-gauge-details__header">
        <div className="c__storage-gauge-details__text">
          <p className="c__storage-gauge-details__title">
            {title ?? t("components.storageGauge.title")}
          </p>
          {resolvedDescription && (
            <div className="c__storage-gauge-details__description">
              <span>{resolvedDescription}</span>
              {info && (
                <Tooltip content={info}>
                  <span
                    className="c__storage-gauge-details__info"
                    tabIndex={0}
                    role="img"
                    aria-label={t("components.storageGauge.infoLabel")}
                  >
                    <Info size={14} />
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        </div>
        {action &&
          (action.href ? (
            <Button
              variant="tertiary"
              color="neutral"
              size="small"
              onClick={action.onClick}
              href={action.href}
              target={action.target ?? "_blank"}
              rel="noopener noreferrer"
            >
              {actionContent}
            </Button>
          ) : (
            <Button
              type="button"
              variant="tertiary"
              color="neutral"
              size="small"
              onClick={action.onClick}
            >
              {actionContent}
            </Button>
          ))}
      </div>
      <div className="c__storage-gauge-details__bar">
        <div
          className="c__storage-gauge-details__bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
