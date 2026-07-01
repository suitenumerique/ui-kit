import {
  createRef,
  Fragment,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectProps,
  SelectStateContext,
  Separator,
} from "react-aria-components";

import { Option } from "@gouvfr-lasuite/cunningham-react";
import clsx from "clsx";

import { MenuItemBody } from "../menu/MenuItemBody";

export type FilterSubContentHelpers = {
  /** Selects this option (sets the Filter's selected key to the option value). */
  select: () => void;
  /** Closes the sub-panel and the Filter popover. */
  close: () => void;
};

export type FilterOption = Option & {
  showSeparator?: boolean;
  isChecked?: boolean;
  /**
   * Renders a custom sub-panel for this option. The row displays a chevron and,
   * on hover, opens a panel hosting the returned content (e.g. a date-range picker).
   */
  subContent?: (helpers: FilterSubContentHelpers) => ReactNode;
};

export type FilterProps = {
  label: string;
  options: FilterOption[];
} & SelectProps;

/** Minimal slice of react-aria's SelectState used to drive custom selection. */
type SelectStateLike = {
  setValue: (value: string) => void;
  close: () => void;
};

type RowRefMap = RefObject<Map<string, RefObject<HTMLDivElement | null>>>;

export const Filter = (props: FilterProps) => {
  // The sub-panel state lives here, in the stable parent, on purpose: react-aria
  // renders the Select/ListBox children subtree twice (a hidden collection pass +
  // the real pass), so any state held inside the Select would be split across two
  // component instances and the hover updates would be lost. Keeping it in `Filter`
  // — and rendering the sub-panel Popover *outside* the <Select> — sidesteps that.
  const rowRefs: RowRefMap = useRef(
    new Map<string, RefObject<HTMLDivElement | null>>(),
  );
  const getRowRef = (value: string) => {
    if (!rowRefs.current.has(value)) {
      rowRefs.current.set(value, createRef<HTMLDivElement>());
    }
    return rowRefs.current.get(value)!;
  };

  // Set from within the Select so the out-of-tree sub-panel can drive selection.
  const selectStateRef = useRef<SelectStateLike | null>(null);

  const [openKey, setOpenKey] = useState<string | null>(null);

  // The content of the currently-open sub-panel, used to move focus into it when
  // it is opened via the keyboard (`focusOnOpen`).
  const panelRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef(false);

  const openSub = (value: string, withFocus = false) => {
    focusOnOpen.current = withFocus;
    setOpenKey(value);
  };

  // Close the open sub-panel on a click outside of it. react-aria disables its
  // own interact-outside dismissal for non-modal popovers (`isDismissable` is
  // false unless it is a submenu), so we handle it ourselves. Clicks on the
  // panel or on its trigger row keep it open; anything else dismisses it.
  useEffect(() => {
    if (!openKey) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const row = getRowRef(openKey).current;
      if (target.closest(".c__filter__subpanel") || row?.contains(target)) {
        return;
      }
      setOpenKey(null);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [openKey]);

  // When a sub-panel is opened via keyboard, move focus to its first focusable
  // element so it is operable without a pointer.
  useEffect(() => {
    if (!openKey || !focusOnOpen.current) {
      return;
    }
    focusOnOpen.current = false;
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? panelRef.current)?.focus();
  }, [openKey]);

  const subOptions = props.options.filter(
    (option) => option.subContent && option.value !== undefined,
  );

  return (
    <>
      <Select
        {...props}
        className="c__filter"
        onSelectionChange={(key) => {
          // Selecting an option changes the Filter value; dismiss any open
          // sub-panel so a stale sub-content popover never lingers.
          setOpenKey(null);
          props.onSelectionChange?.(key);
        }}
      >
        <FilterInner
          {...props}
          getRowRef={getRowRef}
          openSub={openSub}
          selectStateRef={selectStateRef}
        />
      </Select>

      {subOptions.map((option) => {
        const value = option.value as string;
        const helpers: FilterSubContentHelpers = {
          select: () => selectStateRef.current?.setValue(value),
          close: () => {
            setOpenKey(null);
            selectStateRef.current?.close();
          },
        };
        return (
          <Popover
            offset={0}
            key={value}
            triggerRef={getRowRef(value)}
            isOpen={openKey === value}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                // Return focus to the row if the panel currently holds it (e.g.
                // closed via Escape after being opened with the keyboard).
                const restoreFocus = panelRef.current?.contains(
                  document.activeElement,
                );
                setOpenKey(null);
                if (restoreFocus) {
                  getRowRef(value).current?.focus();
                }
              }
            }}
            isNonModal
            placement="right top"
            className="c__filter__subpanel"
          >
            <div ref={openKey === value ? panelRef : undefined}>
              {option.subContent?.(helpers)}
            </div>
          </Popover>
        );
      })}
    </>
  );
};

type FilterInnerProps = FilterProps & {
  getRowRef: (value: string) => RefObject<HTMLDivElement | null>;
  openSub: (value: string, withFocus?: boolean) => void;
  selectStateRef: RefObject<SelectStateLike | null>;
};

const FilterInner = (props: FilterInnerProps) => {
  const { getRowRef, openSub, selectStateRef, ...filterProps } = props;
  const state = useContext(SelectStateContext);

  // Expose the Select state to the out-of-tree sub-panel (see Filter comment).
  selectStateRef.current = state ?? null;

  const selectedOption = state?.value
    ? filterProps.options.find((option) => option.value === state.value)
    : null;

  return (
    <>
      <Button
        className={clsx("c__filter__button", {
          "c__filter__button--active": !!selectedOption,
        })}
      >
        <Label className="c__filter__label">
          {selectedOption ? (
            <>
              {filterProps.label}
              {" : "}
              {selectedOption.label}
            </>
          ) : (
            <>{filterProps.label}</>
          )}
        </Label>
        <span
          aria-hidden="true"
          className={clsx("material-icons c__filter__button__icon", {
            opened: state?.isOpen,
          })}
        >
          keyboard_arrow_down
        </span>
      </Button>
      <Popover
        className="c__dropdown-menu"
        shouldCloseOnInteractOutside={(element) =>
          !element.closest(".c__filter__subpanel")
        }
      >
        {/*
         * Keyboard equivalent of hover for sub-content rows. Handled here in the
         * capture phase (ListBoxItem doesn't accept `onKeyDownCapture`) so it runs
         * before react-aria's selection handler: Enter/Space/ArrowRight on a
         * sub-content row opens its panel and moves focus into it instead of
         * selecting the row.
         */}
        <div
          onKeyDownCapture={(event) => {
            if (
              event.key !== "Enter" &&
              event.key !== " " &&
              event.key !== "ArrowRight"
            ) {
              return;
            }
            const row = (event.target as HTMLElement).closest<HTMLElement>(
              "[data-submenu-value]",
            );
            const value = row?.dataset.submenuValue;
            if (value) {
              event.stopPropagation();
              event.preventDefault();
              openSub(value, true);
            }
          }}
        >
          <ListBox>
            {filterProps.options.map((option) => {
              const hasSubContent =
                !!option.subContent && option.value !== undefined;
              return (
                <Fragment key={option.value}>
                  <ListBoxItem
                    key={option.value}
                    id={option.value}
                    textValue={option.label}
                    className="c__dropdown-menu-item"
                    data-has-submenu={hasSubContent}
                    // Carries the option value (the DOM `id` is a react-aria
                    // generated key) so the keyboard handler can open this row.
                    data-submenu-value={
                      hasSubContent ? option.value : undefined
                    }
                    ref={hasSubContent ? getRowRef(option.value!) : undefined}
                    onMouseEnter={
                      hasSubContent
                        ? () => openSub(option.value as string)
                        : undefined
                    }
                    // Swallow the press in the capture phase so react-aria's Select
                    // never selects this row (which would close the popover). The
                    // sub-panel is driven by hover + its own actions instead.
                    onPointerDownCapture={
                      hasSubContent
                        ? (event) => event.stopPropagation()
                        : undefined
                    }
                    onPointerUpCapture={
                      hasSubContent
                        ? (event) => event.stopPropagation()
                        : undefined
                    }
                  >
                    {/*
                     * Use the ListBoxItem render prop for selection: the checkmark
                     * lives inside the ListBox collection, which react-aria renders
                     * in a pass without `SelectStateContext`, so reading `state`
                     * here is unreliable. `isSelected` is provided per item and is
                     * correct in both controlled and uncontrolled modes.
                     */}
                    {({ isSelected }) => (
                      <MenuItemBody
                        label={option.render ? option.render() : option.label}
                        isChecked={isSelected || option.isChecked}
                        hasSubmenu={hasSubContent}
                      />
                    )}
                  </ListBoxItem>
                  {option.showSeparator && <Separator />}
                </Fragment>
              );
            })}
          </ListBox>
        </div>
      </Popover>
    </>
  );
};
