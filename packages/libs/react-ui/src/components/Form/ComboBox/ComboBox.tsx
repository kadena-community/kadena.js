import { Button } from '@components/Button/NewButton';
import type { IInputProps, ITextFieldProps } from '@components/Form';
import { TextField } from '@components/Form';
import { SystemIcon } from '@components/Icon';
import { Stack } from '@components/Layout';
import { ListBox } from '@components/ListBox';
import { Popover } from '@components/Popover';
import { useObjectRef } from '@react-aria/utils';
import type { CSSProperties, ForwardedRef } from 'react';
import React, { forwardRef, useRef } from 'react';
import type { AriaComboBoxProps } from 'react-aria';
import { mergeProps, useComboBox, useFilter } from 'react-aria';
import { useComboBoxState } from 'react-stately';

export interface IComboBoxProps<T>
  extends Omit<AriaComboBoxProps<T>, 'id' | 'label'> {
  id: IInputProps['id'];
  label: ITextFieldProps['label'];
  width: CSSProperties['width'];
  startIcon?: ITextFieldProps['startIcon'];
}

/**
 * @see https://react-spectrum.adobe.com/react-aria/useComboBox.html
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BaseComboBox = <T extends object>(
  { id, label, width, startIcon, ...props }: IComboBoxProps<T>,
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

  return (
    <Stack display="inline-flex" flexDirection="column">
      <div style={{ width }}>
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
            width={width}
            offset={15} // TODO: Get these values from Textfield element
            crossOffset={startIcon ? -35 : -10} // TODO: Get these values from Textfield element
          >
            <ListBox
              {...mergeProps(props, listBoxProps)}
              state={state}
              listBoxRef={listBoxRef}
            />
          </Popover>
        )}
      </div>
    </Stack>
  );
};

export const ComboBox = forwardRef(BaseComboBox) as <T>(
  props: IComboBoxProps<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => ReturnType<typeof BaseComboBox>;
