import { Command } from "cmdk";
import { ReactNode } from "react";
import { Spinner } from ":/components/loader/Spinner";
import { useCunningham } from "@openfun/cunningham-react";
import { HorizontalSeparator } from ":/components/separator/HorizontalSeparator";

type Props = {
  loading?: boolean;
  inputValue?: string;
  onFilter?: (str: string) => void;
  placeholder?: string;
  children?: ReactNode;
  withSeparator?: boolean;
};
export const QuickSearchInput = ({
  loading,
  inputValue,
  onFilter,
  placeholder,
  children,
  withSeparator: separator = true,
}: Props) => {
  const { t } = useCunningham();

  if (children) {
    return (
      <>
        {children}
        {separator && <HorizontalSeparator />}
      </>
    );
  }

  return (
    <>
      <div className="quick-search-input-container">
        {!loading && <span className="material-icons">search</span>}
        {loading && (
          <div>
            <Spinner size="md" />
          </div>
        )}
        <Command.Input
          autoFocus={true}
          aria-label={t("Quick search input")}
          onClick={(e) => {
            e.stopPropagation();
          }}
          role="combobox"
          value={inputValue}
          placeholder={placeholder}
          onValueChange={onFilter}
        />
      </div>
      {separator && <HorizontalSeparator withPadding={true} />}
    </>
  );
};
