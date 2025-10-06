import { Button, ButtonProps } from "@openfun/cunningham-react";
import { useEffect, useMemo, useState } from "react";
import {
  useDropdownMenu,
  DropdownMenu,
  DropdownMenuOption,
} from ":/components/dropdown-menu";
import { Icon, IconSize } from ":/components/icon";

export type LanguagePickerProps = {
  languages: DropdownMenuOption[];
  onChange?: (language: string) => void;
  color?: ButtonProps["color"];
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  fullWidth?: ButtonProps["fullWidth"];
};

/**
 * A DropdownMenu specific to languages.
 *
 * **Props:**
 * - `languages`: The languages options (use `isChecked` attribute to set the default selected language).
 * - `onChange`: A callback called when a language is selected.
 * - `size`: The size of the CTA.
 * - `color`: The color of the CTA.
 */
export const LanguagePicker = ({
  languages,
  onChange,
  size,
  color = "brand",
  variant = "tertiary",
  fullWidth,
}: LanguagePickerProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();
  const getInitialLanguage = () => {
    const selectedLanguage = languages.find((lang) => lang.isChecked);
    return selectedLanguage?.value ?? languages[0].value!;
  };
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>(getInitialLanguage());

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    onChange?.(value);
  };

  const iconSize = useMemo((): IconSize | undefined => {
    if (!size) return undefined;
    switch (size) {
      case "nano":
        return IconSize.X_SMALL;
      case "small":
        return IconSize.SMALL;
      case "medium":
        return IconSize.MEDIUM;
    }
  }, [size]);

  /**
   * Effect to update the selected language when the `languages` prop changes.
   */
  useEffect(() => {
    setSelectedLanguage(getInitialLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);

  return (
    <DropdownMenu
      options={languages}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSelectValue={handleLanguageChange}
      selectedValues={[selectedLanguage]}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="c__language-picker"
        icon={
          <Icon
            name={isOpen ? "arrow_drop_up" : "arrow_drop_down"}
            aria-hidden="true"
          />
        }
        iconPosition="right"
        size={size}
        color={color}
        variant={variant}
        fullWidth={fullWidth}
      >
        <Icon name="translate" size={iconSize} aria-hidden="true" />
        <span className="c__language-picker__label" lang={selectedLanguage}>
          {languages.find((lang) => lang.value === selectedLanguage)?.label}
        </span>
      </Button>
    </DropdownMenu>
  );
};
