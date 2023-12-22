import { Button } from '@components/Button/NewButton';
import type { IInputProps, ITextFieldProps } from '@components/Form';
import { TextField } from '@components/Form';
import { SystemIcon } from '@components/Icon';
import { Box, IBoxProps, Stack } from '@components/Layout';
import { ListBox } from '@components/ListBox';
import { Popover } from '@components/Popover';
import type { CSSProperties } from 'react';
import React, { useRef } from 'react';
import type { AriaComboBoxProps } from 'react-aria';
import { mergeProps, useComboBox, useFilter } from 'react-aria';
import { useComboBoxState } from 'react-stately';

export interface IComboBoxProps<T>
  extends Omit<AriaComboBoxProps<T>, 'id' | 'label'> {
  id: IInputProps['id'];
  label: ITextFieldProps['label'];
  width: CSSProperties['width'];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ComboBox = <T extends object>({
  id,
  label,
  width,
  ...props
}: IComboBoxProps<T>) => {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({ ...props, defaultFilter: contains });

  // Setup refs and get props for child elements.
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);

  const {
    buttonProps,
    inputProps,
    listBoxProps,
    // labelProps
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state,
  );

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      {/* <label {...labelProps}>{props.label}</label> */}
      <div style={{ width }}>
        <TextField
          {...inputProps}
          label={label}
          id={id}
          startIcon={<SystemIcon.KeyIconFilled />}
          ref={inputRef}
        >
          <Button {...buttonProps} ref={buttonRef}>
            <span aria-hidden="true">▼</span>
          </Button>
        </TextField>
        {state.isOpen && (
          <Popover
            state={state}
            triggerRef={inputRef}
            popoverRef={popoverRef}
            isNonModal
            placement="bottom start"
            width={width}
            offset={10} // TODO: Get these values from Textfield element
            crossOffset={-35} // TODO: Get these values from Textfield element
          >
            <ListBox
              {...mergeProps(props, listBoxProps)}
              // {...listBoxProps}
              state={state}
              listBoxRef={listBoxRef}
            />
          </Popover>
        )}
      </div>
    </div>
  );
};
