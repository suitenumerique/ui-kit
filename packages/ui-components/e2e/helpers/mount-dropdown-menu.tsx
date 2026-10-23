import { forwardRef, HTMLAttributes, ReactNode, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import { Button } from "../../src/components/button";
import { Tooltip } from "../../src/components/tooltip";
import { DropdownMenu } from "../../src/components/dropdown-menu/DropdownMenu";
import {
  DropdownMenuItem,
  DropdownMenuProps,
} from "../../src/components/dropdown-menu/types";
import { Edit } from "../../src/components/icon/icons/Edit";
import { Trash } from "../../src/components/icon/icons/Trash";

/**
 * Playwright CT bridges function props as one-way dispatchers, so this helper
 * owns the state and the callbacks in the browser. Tests pick a scenario and a
 * trigger with serializable props, then read the results from the outputs.
 */

export type TriggerKind =
  | "button"
  | "icon-button"
  | "native"
  | "div"
  | "custom"
  | "tooltip"
  | "aria-button";

export type Scenario =
  | "actions"
  | "selection"
  | "mixed"
  | "checked"
  | "submenus"
  | "options"
  | "long"
  | "long-labels";

const CustomTrigger = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>((props, ref) => (
  <span {...props} ref={ref} role="button" tabIndex={0}>
    Custom
  </span>
));
CustomTrigger.displayName = "CustomTrigger";

const renderTrigger = (kind: TriggerKind): ReactNode => {
  switch (kind) {
    case "button":
      return <Button>Actions</Button>;
    case "icon-button":
      return <Button icon={<Edit />} aria-label="Actions" />;
    case "native":
      return <button>Actions</button>;
    case "div":
      return (
        <div role="button" tabIndex={0} aria-label="Actions">
          JM
        </div>
      );
    case "custom":
      return <CustomTrigger aria-label="Actions" />;
    case "tooltip":
      return (
        <Tooltip content="Actions tooltip">
          <Button icon={<Edit />} aria-label="Actions" />
        </Tooltip>
      );
    case "aria-button":
      return <AriaButton>Actions</AriaButton>;
  }
};

type SelectionState = {
  values: string[];
  setValues: (values: string[]) => void;
};

const buildOptions = (
  scenario: Scenario,
  act: (name: string) => () => void,
  sort: { value: string; set: (value: string) => void },
): DropdownMenuItem[] => {
  const roles: DropdownMenuItem[] = [
    { label: "Reader", value: "reader", subText: "Can view" },
    { label: "Commenter", value: "commenter" },
    { label: "Editor", value: "editor", callback: act("editor callback") },
    { label: "Administrator", value: "administrator", isDisabled: true },
  ];

  switch (scenario) {
    case "actions":
      return [
        { label: "Rename", icon: <Edit />, callback: act("rename") },
        {
          label: "Duplicate",
          subText: "Make a copy",
          callback: act("duplicate"),
        },
        { label: "Archive", isDisabled: true, callback: act("archive") },
        { label: "Download", callback: act("download") },
        { type: "separator" },
        {
          label: "Delete",
          icon: <Trash />,
          variant: "danger",
          testId: "delete-item",
          callback: act("delete"),
        },
      ];
    case "selection":
      return roles;
    case "mixed":
      return [
        ...roles,
        { type: "separator" },
        {
          label: "Remove access",
          variant: "danger",
          callback: act("remove"),
        },
      ];
    case "checked":
      return ["name", "date", "size"].map((value) => ({
        label: value[0].toUpperCase() + value.slice(1),
        isChecked: sort.value === value,
        keepOpen: true,
        callback: () => sort.set(value),
      }));
    case "submenus":
      return [
        { label: "Rename", callback: act("rename") },
        {
          label: "Share",
          children: [
            { label: "Copy link", callback: act("copy link") },
            {
              label: "Export",
              children: [{ label: "PDF", callback: act("pdf") }],
            },
          ],
        },
        { label: "Delete", callback: act("delete") },
      ];
    case "options":
      return [
        { type: "separator" },
        { label: "Open", shortcut: "⌘O", callback: act("open") },
        { type: "separator" },
        { label: "Restore", isHidden: true },
        { type: "separator" },
        {
          label: "Help",
          opensInNewWindow: true,
          showSeparator: true,
          callback: act("help"),
        },
        { label: "Changelog", href: "#changelog" },
        { type: "separator" },
      ];
    case "long-labels":
      return [
        { label: "Rename", callback: act("rename") },
        {
          label: "Share with every member of the workspace and their guests",
          subText:
            "Members get the editor role, guests keep their current role",
          callback: act("share"),
        },
      ];
    case "long":
      return Array.from({ length: 40 }, (_, index) => ({
        label: `Folder ${index + 1}`,
        callback: act(`folder ${index + 1}`),
      }));
  }
};

export const TestDropdownMenu = ({
  scenario = "actions",
  triggerKind = "button",
  controlled = false,
  legacyToggle = false,
  inClickableParent = false,
  inForm = false,
  multiple = false,
  initialValues = [],
  keepOpenOnOutsideClick = false,
  ...props
}: Partial<
  Omit<DropdownMenuProps, "children" | "options" | "onSelectValue">
> & {
  scenario?: Scenario;
  triggerKind?: TriggerKind;
  controlled?: boolean;
  /**
   * Migration case: the trigger still toggles the controlled state in its
   * own onClick, as the previous DropdownMenu required.
   */
  legacyToggle?: boolean;
  /** Renders the menu inside a parent that logs the events reaching it. */
  inClickableParent?: boolean;
  inForm?: boolean;
  multiple?: boolean;
  initialValues?: string[];
  /** Ignores clicks outside the menu, through shouldCloseOnInteractOutside. */
  keepOpenOnOutsideClick?: boolean;
}) => {
  const [lastAction, setLastAction] = useState("");
  const [values, setValues] = useState<string[]>(initialValues);
  const [sort, setSort] = useState("name");
  const [isOpen, setIsOpen] = useState(false);
  const [openChanges, setOpenChanges] = useState<string[]>([]);
  const [submitCount, setSubmitCount] = useState(0);
  const [parentEvents, setParentEvents] = useState<string[]>([]);
  const logParentEvent = (name: string) => () =>
    setParentEvents((events) => [...events, name]);
  const selection: SelectionState = { values, setValues };

  const act = (name: string) => () => setLastAction(name);
  const options = buildOptions(scenario, act, { value: sort, set: setSort });

  const menu = (
    <DropdownMenu
      {...props}
      options={options}
      selectionMode={multiple ? "multiple" : props.selectionMode}
      selectedValues={selection.values}
      onSelectValue={(value) => {
        setLastAction(`select ${value}`);
        selection.setValues(
          !multiple
            ? [value]
            : selection.values.includes(value)
              ? selection.values.filter((selected) => selected !== value)
              : [...selection.values, value],
        );
      }}
      isOpen={controlled ? isOpen : props.isOpen}
      onOpenChange={(open) => {
        setOpenChanges((changes) => [...changes, String(open)]);
        if (controlled) setIsOpen(open);
      }}
      shouldCloseOnInteractOutside={
        keepOpenOnOutsideClick ? () => false : undefined
      }
    >
      {legacyToggle ? (
        <Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>
      ) : (
        renderTrigger(triggerKind)
      )}
    </DropdownMenu>
  );

  return (
    <CunninghamProvider>
      <div style={{ padding: 16 }}>
        <button>Before</button>
        {inClickableParent ? (
          <div
            data-testid="clickable-parent"
            onClick={logParentEvent("click")}
            onPointerDown={logParentEvent("pointerdown")}
            onKeyDown={logParentEvent("keydown")}
          >
            {menu}
          </div>
        ) : inForm ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitCount((count) => count + 1);
            }}
          >
            {menu}
          </form>
        ) : (
          menu
        )}
        <output aria-label="Last action">{lastAction}</output>
        <output aria-label="Selected">{values.join(",")}</output>
        <output aria-label="Sort">{sort}</output>
        <output aria-label="Open changes">{openChanges.join(",")}</output>
        <output aria-label="Submitted">{submitCount}</output>
        <output aria-label="Parent events">{parentEvents.join(",")}</output>
        {controlled && (
          <button onClick={() => setIsOpen(true)}>Open from outside</button>
        )}
      </div>
    </CunninghamProvider>
  );
};
