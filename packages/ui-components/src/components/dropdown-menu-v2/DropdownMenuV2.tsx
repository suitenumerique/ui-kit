import { useMemo } from "react";
import {
  buildMenuModel,
  MenuModelItem,
  MenuModelLevel,
  MenuModelNode,
} from "./buildMenuModel";
import { DropdownMenuV2Popover } from "./DropdownMenuV2Popover";
import { DropdownMenuV2Trigger } from "./DropdownMenuV2Trigger";
import { MenuItemV2 } from "./MenuItemV2";
import { MenuSectionV2 } from "./MenuSectionV2";
import { MenuSeparatorV2 } from "./MenuSeparatorV2";
import { SubmenuTriggerV2 } from "./SubmenuTriggerV2";
import {
  DropdownMenuV2PopoverOwnProps,
  DropdownMenuV2Props,
  DropdownMenuV2SelectionMode,
} from "./types";

type RenderContext = {
  selectionMode: DropdownMenuV2SelectionMode;
  onSelectValue?: (value: string) => void;
};

const renderItem = (item: MenuModelItem, context: RenderContext) => {
  const { option } = item;
  const itemProps = {
    id: item.key,
    icon: option.icon,
    description: option.subText,
    shortcut: option.shortcut,
    variant: option.variant,
    opensInNewWindow: option.opensInNewWindow,
    isDisabled: option.isDisabled,
    href: option.href,
    target: option.target,
    rel: option.rel,
  };

  if (item.submenu) {
    return (
      <SubmenuTriggerV2 key={item.key}>
        <MenuItemV2 {...itemProps} data-testid={option.testId}>
          {option.label}
        </MenuItemV2>
        {renderLevel(item.submenu, context)}
      </SubmenuTriggerV2>
    );
  }

  return (
    <MenuItemV2
      key={item.key}
      {...itemProps}
      data-testid={option.testId}
      shouldCloseOnSelect={option.keepOpen ? false : undefined}
      onAction={() => {
        if (option.value) {
          context.onSelectValue?.(option.value);
        }
        option.callback?.();
      }}
    >
      {option.label}
    </MenuItemV2>
  );
};

const renderNode = (node: MenuModelNode, context: RenderContext) => {
  switch (node.kind) {
    case "separator":
      return <MenuSeparatorV2 key={node.key} />;
    case "group":
      return (
        <MenuSectionV2
          key={node.key}
          id={node.key}
          selectionMode={context.selectionMode}
          selectedKeys={node.selectedKeys}
        >
          {node.items.map((item) => renderItem(item, context))}
        </MenuSectionV2>
      );
    case "item":
      return renderItem(node, context);
  }
};

const renderLevel = (
  level: MenuModelLevel,
  context: RenderContext,
  popoverProps: DropdownMenuV2PopoverOwnProps = {},
) => (
  <DropdownMenuV2Popover
    {...popoverProps}
    {...(level.selection === "menu" && {
      selectionMode: context.selectionMode,
      selectedKeys: level.selectedKeys,
    })}
  >
    {level.nodes.map((node) => renderNode(node, context))}
  </DropdownMenuV2Popover>
);

/**
 * An accessible menu opened from any trigger element, built on React Aria.
 * It takes the same `options` as DropdownMenu (V1).
 *
 * Items with a `value` or an `isChecked` flag are exposed as radio items
 * (`selectionMode="single"`) or checkbox items (`"multiple"`); the others stay
 * plain menu items.
 */
export const DropdownMenuV2 = ({
  children,
  options,
  isOpen,
  defaultOpen,
  onOpenChange,
  trigger,
  selectedValues,
  onSelectValue,
  selectionMode = "single",
  variant = "default",
  topMessage,
  bottomMessage,
  placement,
  offset,
  shouldCloseOnInteractOutside,
  className,
}: DropdownMenuV2Props) => {
  const model = useMemo(
    () => buildMenuModel(options, selectedValues),
    [options, selectedValues],
  );

  return (
    <DropdownMenuV2Trigger
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
    >
      {children}
      {renderLevel(
        model,
        { selectionMode, onSelectValue },
        {
          variant,
          topMessage,
          bottomMessage,
          placement,
          offset,
          shouldCloseOnInteractOutside,
          className,
        },
      )}
    </DropdownMenuV2Trigger>
  );
};
