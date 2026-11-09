import { Command } from "cmdk";
import { KeyboardEvent, ReactNode, useRef } from "react";
import { QuickSearchInput } from "./QuickSearchInput";
import { hasChildrens } from ":/utils/children";

export type QuickSearchProps = {
  onFilter?: (str: string) => void;
  inputValue?: string;
  inputContent?: ReactNode;
  showInput?: boolean;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  children?: ReactNode;
};

// cmdk cancels every Enter that reaches its root, which blocks buttons and
// menus rendered inside it. Only the search input needs cmdk's Enter.
const keepEnterOnControls = (event: KeyboardEvent<HTMLDivElement>) => {
  if (
    event.key === "Enter" &&
    !(event.target as HTMLElement).hasAttribute("cmdk-input")
  ) {
    event.stopPropagation();
  }
};

export const QuickSearch = ({
  onFilter,
  inputContent,
  inputValue,
  loading,
  showInput = true,
  label,
  placeholder,
  children,
}: QuickSearchProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className="quick-search-container">
        <Command label={label} shouldFilter={false} ref={ref}>
          <div className="quick-search-content" onKeyDown={keepEnterOnControls}>
            {showInput && (
              <QuickSearchInput
                loading={loading}
                withSeparator={hasChildrens(children)}
                inputValue={inputValue}
                onFilter={onFilter}
                placeholder={placeholder}
              >
                {inputContent}
              </QuickSearchInput>
            )}
            <Command.List>
              <div>{children}</div>
            </Command.List>
          </div>
        </Command>
      </div>
    </>
  );
};
