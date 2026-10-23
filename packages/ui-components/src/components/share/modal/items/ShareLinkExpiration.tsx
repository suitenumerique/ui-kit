import type { RefObject } from "react";
import { Dialog, Popover } from "react-aria-components";
import {
  fromDate,
  getLocalTimeZone,
  toCalendarDate,
  today,
} from "@internationalized/date";
import { Calendar } from ":/components/calendar";
import type { DropdownMenuOption } from ":/components/dropdown-menu";
import type { TranslationKey } from ":/types/translations";

/** Durations, in days, offered as shortcuts in the "Link expires" submenu. */
export const LINK_EXPIRATION_PRESETS = [1, 7, 30];

/**
 * A link expires at the end of its last day, so that "until Jan 13" grants
 * access during the whole day of Jan 13 whatever the time it was set at.
 */
export const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 0);
  return endOfDay;
};

export const getLinkExpirationFromToday = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return getEndOfDay(date);
};

type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

type LinkExpirationOptionParams = {
  t: Translate;
  linkExpiresAt?: Date | null;
  onSelect: (value: Date | null) => void;
  onChooseDate: () => void;
};

/** Builds the "Link expires" entry and its submenu for the link role dropdown. */
export const getLinkExpirationOption = ({
  t,
  linkExpiresAt,
  onSelect,
  onChooseDate,
}: LinkExpirationOptionParams): DropdownMenuOption => ({
  id: "link-expiration",
  label: t("components.share.linkSettings.expiration.menu"),
  testId: "share-link-expiration-menu",
  children: [
    {
      id: "link-expiration-never",
      label: t("components.share.linkSettings.expiration.never"),
      isChecked: !linkExpiresAt,
      callback: () => onSelect(null),
    },
    ...LINK_EXPIRATION_PRESETS.map((days) => ({
      id: `link-expiration-${days}`,
      label: t(
        days === 1
          ? "components.share.linkSettings.expiration.days_singular"
          : "components.share.linkSettings.expiration.days_plural",
        { count: days },
      ),
      callback: () => onSelect(getLinkExpirationFromToday(days)),
    })),
    {
      id: "link-expiration-custom",
      label: t("components.share.linkSettings.expiration.choose_date"),
      callback: onChooseDate,
    },
  ],
});

type ShareLinkExpirationPickerProps = {
  triggerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  linkExpiresAt?: Date | null;
  onConfirm: (value: Date) => void;
  ariaLabel: string;
};

/** Calendar anchored to the link role dropdown to pick a custom expiration. */
export const ShareLinkExpirationPicker = ({
  triggerRef,
  isOpen,
  onOpenChange,
  linkExpiresAt,
  onConfirm,
  ariaLabel,
}: ShareLinkExpirationPickerProps) => {
  const timeZone = getLocalTimeZone();
  const minValue = today(timeZone);
  const currentValue = linkExpiresAt
    ? toCalendarDate(fromDate(linkExpiresAt, timeZone))
    : undefined;
  // An already expired date cannot be selected again, start from scratch.
  const defaultValue =
    currentValue && currentValue.compare(minValue) >= 0
      ? currentValue
      : undefined;

  return (
    <Popover
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom end"
      shouldFlip
      containerPadding={16}
    >
      <Dialog
        aria-label={ariaLabel}
        className="c__share-modal__link-expiration-picker"
        data-testid="share-link-expiration-picker"
      >
        <Calendar
          aria-label={ariaLabel}
          minValue={minValue}
          defaultValue={defaultValue}
          onCancel={() => onOpenChange(false)}
          onOk={(value) => {
            if (!value) {
              return;
            }
            onConfirm(getEndOfDay(toCalendarDate(value).toDate(timeZone)));
            onOpenChange(false);
          }}
        />
      </Dialog>
    </Popover>
  );
};
