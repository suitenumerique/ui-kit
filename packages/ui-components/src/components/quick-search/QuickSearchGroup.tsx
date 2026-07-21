import { ReactNode } from "react";
import { Command } from "cmdk";

import { QuickSearchData } from "./types";
import { QuickSearchItem } from "./QuickSearchItem";

export type QuickSearchGroupProps<T> = {
  group: QuickSearchData<T>;
  renderElement?: (element: T) => ReactNode;
  onSelect?: (element: T) => void;
};

export const QuickSearchGroup = <T,>({
  group,
  onSelect,
  renderElement,
}: QuickSearchGroupProps<T>) => {
  if (!group.showWhenEmpty && group.elements.length === 0) {
    return null;
  }
  return (
    <div>
      <Command.Group
        key={group.groupName}
        heading={group.groupName}
        forceMount={false}
      >
        {group.startActions?.map((action, index) => {
          return (
            <QuickSearchItem
              key={`${group.groupName}-action-${index}`}
              onSelect={action.onSelect}
            >
              {action.content}
            </QuickSearchItem>
          );
        })}
        {group.elements.map((groupElement, index) => {
          return (
            <QuickSearchItem
              id={`${group.groupName}-element-${index}`}
              key={`${group.groupName}-element-${index}`}
              onSelect={() => {
                onSelect?.(groupElement);
              }}
            >
              {renderElement?.(groupElement)}
            </QuickSearchItem>
          );
        })}
        {group.endActions?.map((action, index) => {
          return (
            <QuickSearchItem
              key={`${group.groupName}-action-${index}`}
              onSelect={action.onSelect}
            >
              {action.content}
            </QuickSearchItem>
          );
        })}
        {group.emptyString && group.elements.length === 0 && (
          <span className="quick-search-group__empty-string">
            {group.emptyString}
          </span>
        )}
      </Command.Group>
    </div>
  );
};
