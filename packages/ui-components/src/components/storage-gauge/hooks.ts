import { useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { StorageGaugeProps } from "./types";

export const useStorageGauge = ({
  used,
  total,
  precision = 2,
}: StorageGaugeProps) => {
  const { currentLocale } = useCunningham();

  const formatNumber = (value: number, decimals: number) =>
    value.toLocaleString(currentLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const formattedUsed = formatNumber(used, precision);
  const formattedTotal = Number.isInteger(total)
    ? total.toLocaleString(currentLocale)
    : formatNumber(total, precision);

  return {
    formattedUsed,
    formattedTotal,
  };
};
