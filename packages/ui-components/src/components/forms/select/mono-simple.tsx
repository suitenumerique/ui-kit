import { useSelect, UseSelectReturnValue } from "downshift";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import {
  optionToString,
  optionToValue,
  SelectMonoAux,
  SubProps,
} from ":/components/forms/select/mono-common";
import { Option, SelectProps } from ":/components/forms/select";
import { SelectedOption } from ":/components/forms/select/utils";

/**
 * Here we ensure that the selected item is always in sync with the options.
 * Ex: If the selected options changes label we want to reflect that.
 * @param downshiftReturn
 * @param props
 */
const useKeepSelectedItemInSyncWithOptions = (
  downshiftReturn: UseSelectReturnValue<Option>,
  props: Pick<SelectProps, "value" | "options">,
) => {
  useEffect(() => {
    const optionToSelect = props.options.find(
      (option) => optionToValue(option) === props.value,
    );
    downshiftReturn.selectItem(optionToSelect ?? null);
  }, [props.value, props.options]);
};

export const SelectMonoSimple = ({ ref, ...props }: SubProps) => {
  const downshiftReturn = useSelect({
    ...props.downshiftProps,
    items: props.options,
    itemToString: optionToString,
  });

  useKeepSelectedItemInSyncWithOptions(downshiftReturn, props);

  const wrapperRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    blur: () => {
      downshiftReturn.closeMenu();
      wrapperRef.current?.blur();
    },
  }));

  return (
    <SelectMonoAux
      {...props}
      downshiftReturn={{
        ...downshiftReturn,
        wrapperProps: downshiftReturn.getToggleButtonProps({
          disabled: props.disabled,
          ref: wrapperRef,
        }),
        toggleButtonProps: {},
      }}
      labelAsPlaceholder={!downshiftReturn.selectedItem}
    >
      <SelectedOption option={downshiftReturn.selectedItem} {...props} />
    </SelectMonoAux>
  );
};
