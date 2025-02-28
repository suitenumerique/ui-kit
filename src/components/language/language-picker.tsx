import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { DropdownMenuOption } from ":/components/dropdown-menu/types";
import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";
import { Button } from "@openfun/cunningham-react";

export type LanguagePickerProps = {
  languages: DropdownMenuOption[];
};

export const LanguagePicker = ({ languages }: LanguagePickerProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();

  return (
    <DropdownMenu options={languages} isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        color="primary-text"
        className="c__language-picker"
      >
        <span className="material-icons">translate</span>
        <span className="c__language-picker__label">Français</span>
        <span className="material-icons">
          {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </Button>
    </DropdownMenu>
  );
};
