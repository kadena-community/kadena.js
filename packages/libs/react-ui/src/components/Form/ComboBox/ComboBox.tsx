import { Button } from '@components/Button/NewButton';
import type { IInputProps, ITextFieldProps } from '@components/Form';
import { TextField } from '@components/Form';
import { SystemIcon } from '@components/Icon';
import { Stack } from '@components/Layout';
import { ListBox } from '@components/ListBox';
import { Popover } from '@components/Popover';
import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef } from 'react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { AriaComboBoxProps } from 'react-aria';
import { mergeProps, useComboBox, useFilter } from 'react-aria';
import { useComboBoxState } from 'react-stately';

export interface IComboBoxProps<T>
  extends Omit<AriaComboBoxProps<T>, 'id' | 'label'> {
  id: IInputProps['id'];
  label: ITextFieldProps['label'];
  startIcon?: ITextFieldProps['startIcon'];
}

/**
 * 6 = difference between input field height and icon button height (divided by 2) = (48 - 36) / 2
 * 5 = offset for outline (width + offset) + box-shadow = 2 + 2 + 1
 * 2 = additional offset threshold to make it look good
 *
 * @see packages/libs/react-ui/src/components/Form/Form.css.ts
 */
const POPOVER_OFFSET = 6 + 5 + 2;

/**
 * 8 = left padding of input field
 *
 * @see packages/libs/react-ui/src/components/Form/Input/Input.css.ts
 */
const POPOVER_CROSS_OFFSET = -8;

/**
 * 24 = width of icon
 * 4 = gap width between icon and input field
 */
const POPOVER_CROSS_OFFSET_WITH_ICON = POPOVER_CROSS_OFFSET - 24 - 4;

/**
 * @see https://react-spectrum.adobe.com/react-aria/useComboBox.html
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BaseComboBox = <T extends object>(
  { id, label, startIcon, ...props }: IComboBoxProps<T>,
  forwardedRef: ForwardedRef<HTMLInputElement>,
) => {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({ ...props, defaultFilter: contains });

  // Setup refs and get props for child elements.
  const buttonRef = useRef(null);
  const inputRef = useObjectRef(forwardedRef);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);

  const { buttonProps, inputProps, listBoxProps } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state,
  );

  const [textFieldWidth, setTextFieldWidth] = useState(0);
  useEffect(() => {
    setTextFieldWidth(inputRef.current.parentElement!.offsetWidth);
  }, []);

  return (
    <Stack display="inline-flex" flexDirection="column">
      <Button
        {...buttonProps}
        ref={buttonRef}
        icon={<SystemIcon.OptionsOpen />}
      />
      {/* @ts-expect-error */}
      <TextField
        {...inputProps}
        label={label}
        id={id}
        startIcon={startIcon}
        ref={inputRef}
      >
        <Button
          {...buttonProps}
          ref={buttonRef}
          icon={<SystemIcon.OptionsOpen />}
        />
      </TextField>
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={inputRef}
          popoverRef={popoverRef}
          isNonModal
          placement="bottom start"
          width={textFieldWidth}
          offset={POPOVER_OFFSET}
          crossOffset={
            startIcon ? POPOVER_CROSS_OFFSET_WITH_ICON : POPOVER_CROSS_OFFSET
          }
        >
          <ListBox
            {...mergeProps(props, listBoxProps)}
            state={state}
            listBoxRef={listBoxRef}
          />
        </Popover>
      )}
    </Stack>
  );
};

export const ComboBox = forwardRef(BaseComboBox) as <T>(
  props: IComboBoxProps<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => ReturnType<typeof BaseComboBox>;
