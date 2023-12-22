import { Button } from '@components/Button/NewButton';
import type { IInputProps } from '@components/Form';
import { TextField } from '@components/Form';
import { SystemIcon } from '@components/Icon';
import { Stack } from '@components/Layout';
import { ListBox } from '@components/ListBox';
import { Popover } from '@components/Popover';
import React, { useRef } from 'react';
import type { AriaComboBoxProps } from 'react-aria';
import { mergeProps, useComboBox, useFilter } from 'react-aria';
import { useComboBoxState } from 'react-stately';

export interface IComboBoxProps<T> extends Omit<AriaComboBoxProps<T>, 'id'> {
  id: IInputProps['id'];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ComboBox = <T extends object>({
  id,
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

  const { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
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
      <label {...labelProps}>{props.label}</label>
      <div>
        <Stack gap="$xs" alignItems="stretch">
          <TextField
            {...inputProps}
            id={id}
            startIcon={<SystemIcon.KeyIconFilled />}
            ref={inputRef}
          >
            <Button {...buttonProps} ref={buttonRef}>
              <span aria-hidden="true">▼</span>
            </Button>
          </TextField>
        </Stack>
        {state.isOpen && (
          <Popover
            state={state}
            triggerRef={inputRef}
            popoverRef={popoverRef}
            isNonModal
            placement="bottom start"
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
