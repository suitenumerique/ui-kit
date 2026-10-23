import {
  MenuModelItem,
  MenuModelLevel,
  MenuModelNode,
} from "./buildMenuModel";
import { DropdownMenuItemComponent } from "./DropdownMenuItemComponent";
import { DropdownMenuPopover } from "./DropdownMenuPopover";
import { DropdownMenuSection } from "./DropdownMenuSection";
import { DropdownMenuSeparator } from "./DropdownMenuSeparator";
import { DropdownMenuSubmenu } from "./DropdownMenuSubmenu";
import { DropdownMenuPopoverProps, DropdownMenuSelectionMode } from "./types";

export type MenuRenderContext = {
  selectionMode: DropdownMenuSelectionMode;
  onSelectValue?: (value: string) => void;
};

const renderItem = (item: MenuModelItem, context: MenuRenderContext) => {
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
      <DropdownMenuSubmenu key={item.key}>
        <DropdownMenuItemComponent {...itemProps} data-testid={option.testId}>
          {option.label}
        </DropdownMenuItemComponent>
        {renderMenuLevel(item.submenu, context)}
      </DropdownMenuSubmenu>
    );
  }

  return (
    <DropdownMenuItemComponent
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
    </DropdownMenuItemComponent>
  );
};

const renderNode = (node: MenuModelNode, context: MenuRenderContext) => {
  switch (node.kind) {
    case "separator":
      return <DropdownMenuSeparator key={node.key} />;
    case "group":
      return (
        <DropdownMenuSection
          key={node.key}
          id={node.key}
          selectionMode={context.selectionMode}
          selectedKeys={node.selectedKeys}
        >
          {node.items.map((item) => renderItem(item, context))}
        </DropdownMenuSection>
      );
    case "item":
      return renderItem(node, context);
  }
};

/**
 * Renders a menu level built by `buildMenuModel` (and its submenus) as a
 * `DropdownMenu.Popover`. Shared by DropdownMenu and ContextMenu.
 */
export const renderMenuLevel = (
  level: MenuModelLevel,
  context: MenuRenderContext,
  popoverProps: Omit<DropdownMenuPopoverProps, "children"> = {},
) => (
  <DropdownMenuPopover
    {...popoverProps}
    {...(level.selection === "menu" && {
      selectionMode: context.selectionMode,
      selectedKeys: level.selectedKeys,
    })}
  >
    {level.nodes.map((node) => renderNode(node, context))}
  </DropdownMenuPopover>
);
