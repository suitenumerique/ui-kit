import { useEffect, useId, useRef, useState } from "react";
import { ListBox, ListBoxItem, Popover } from "react-aria-components";
import clsx from "clsx";
import { HorizontalSeparator } from ":/components/separator/HorizontalSeparator";
import { Spinner } from ":/components/loader/Spinner";
import { SearchFilterItem, SearchFilterProps } from "./types";

export const SearchFilter = <T extends SearchFilterItem = SearchFilterItem>(
  props: SearchFilterProps<T>,
) => {
  const {
    label,
    activeLabel,
    isActive,
    searchValue = "",
    onSearchChange,
    placeholder,
    items,
    renderItem,
    onItemSelect,
    isLoading,
    emptyState,
    isOpen: controlledIsOpen,
    onOpenChange,
  } = props;

  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = (value: boolean) => {
    setInternalIsOpen(value);
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (isOpen) {
      // Wait for popover to render before focusing
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      // Focus moves to ListBox automatically via react-aria
      const listBox = inputRef.current
        ?.closest(".c__search-filter__popover")
        ?.querySelector<HTMLElement>("[role='listbox']");
      listBox?.focus();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const active = isActive ?? !!activeLabel;

  return (
    <div className="c__search-filter">
      <button
        ref={triggerRef}
        id={id}
        className={clsx("c__filter__button", {
          "c__filter__button--active": active,
        })}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <span className="c__filter__label">
          {activeLabel ? (
            <>
              {label}
              {" : "}
              {activeLabel}
            </>
          ) : (
            label
          )}
        </span>
        <span
          aria-hidden="true"
          className={clsx("material-icons c__filter__button__icon", {
            opened: isOpen,
          })}
        >
          keyboard_arrow_down
        </span>
      </button>

      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        className="c__dropdown-menu c__search-filter__popover"
        style={{ marginTop: "0px" }}
      >
        <div className="c__search-filter__search">
          <span className="material-icons" aria-hidden="true">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleInputKeyDown}
            aria-label={placeholder || label}
          />
        </div>
        <HorizontalSeparator withPadding={false} />
        <ListBox
          className="c__search-filter__list"
          aria-labelledby={id}
          onAction={(key) => {
            const item = items.find((i) => i.id === key);
            if (item) {
              onItemSelect?.(item);
              onSearchChange("");
              setIsOpen(false);
            }
          }}
        >
          {isLoading && (
            <ListBoxItem id="__loading" className="c__search-filter__loading" textValue="Loading">
              <Spinner />
            </ListBoxItem>
          )}
          {!isLoading && items.length === 0 && emptyState && (
            <ListBoxItem id="__empty" className="c__search-filter__empty" textValue="Empty">
              {emptyState}
            </ListBoxItem>
          )}
          {!isLoading &&
            items.map((item) => (
              <ListBoxItem
                key={item.id}
                id={item.id}
                className="c__search-filter__item"
                textValue={item.label}
              >
                {renderItem(item)}
              </ListBoxItem>
            ))}
        </ListBox>
      </Popover>
    </div>
  );
};
