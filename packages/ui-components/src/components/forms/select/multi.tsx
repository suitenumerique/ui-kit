import React, { useEffect } from "react";
import { optionToValue } from ":/components/forms/select/mono-common";
import { SelectMultiSearchable } from ":/components/forms/select/multi-searchable";
import { SelectMultiSimple } from ":/components/forms/select/multi-simple";
import { SubProps } from ":/components/forms/select/multi-common";
import { Option, SelectProps } from ":/components/forms/select/index";

export type SelectMultiProps = Omit<SelectProps, "onChange"> & {
  onChange?: (event: { target: { value: string[] } }) => void;
};

export const SelectMulti = (props: SelectMultiProps) => {
  const getSelectedItemsFromProps = () => {
    const valueToUse = props.defaultValue ?? props.value ?? [];
    return props.options.filter((option) =>
      (valueToUse as string[]).includes(optionToValue(option)),
    );
  };

  const [selectedItems, setSelectedItems] = React.useState<Option[]>(
    getSelectedItemsFromProps(),
  );

  // If the component is used as a controlled component, we need to update the local value when the value prop changes.
  useEffect(() => {
    // Means it is not controlled.
    if (props.defaultValue !== undefined) {
      return;
    }
    setSelectedItems(getSelectedItemsFromProps());
  }, [JSON.stringify(props.value)]);

  // If the component is used as an uncontrolled component, we need to update the parent value when the local value changes.
  useEffect(() => {
    props.onChange?.({ target: { value: selectedItems.map(optionToValue) } });
  }, [JSON.stringify(selectedItems)]);

  const onSelectedItemsChange: SubProps["onSelectedItemsChange"] = (
    newSelectedItems,
  ) => {
    setSelectedItems(newSelectedItems);
  };

  const defaultProps: Partial<SelectMultiProps> = {
    selectedItemsStyle: "pills",
    menuOptionsStyle: "plain",
    clearable: true,
  };

  return props.searchable ? (
    <SelectMultiSearchable
      {...defaultProps}
      {...props}
      selectedItems={selectedItems}
      onSelectedItemsChange={onSelectedItemsChange}
    />
  ) : (
    <SelectMultiSimple
      {...defaultProps}
      {...props}
      selectedItems={selectedItems}
      onSelectedItemsChange={onSelectedItemsChange}
    />
  );
};
