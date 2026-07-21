import { Command } from "cmdk";
import { ReactNode, useRef } from "react";
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
        </Command>
      </div>
    </>
  );
};
