import { Button } from '@components/Button';
import { ListBox } from '@components/ListBox';
import { Popover } from '@components/Popover';
import React, { useRef } from 'react';
import type { AriaComboBoxProps } from 'react-aria';
import { mergeProps, useComboBox, useFilter } from 'react-aria';
import { useComboBoxState } from 'react-stately';

// Reuse the ListBox, Popover, and Button from your component library. See below for details.
// import { Button, ListBox, Popover } from '@components';

export interface IComboBoxProps<T> extends AriaComboBoxProps<T> {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ComboBox = <T extends object>(props: IComboBoxProps<T>) => {
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
        <input
          {...inputProps}
          ref={inputRef}
          style={{
            height: 24,
            boxSizing: 'border-box',
            marginRight: 0,
            fontSize: 16,
          }}
        />
        <Button
          {...buttonProps}
          // buttonRef={buttonRef}
          style={{
            height: 24,
            marginLeft: 0,
          }}
        >
          <span aria-hidden="true" style={{ padding: '0 2px' }}>
            ▼
          </span>
        </Button>
        {state.isOpen && (
          <Popover
            state={state}
            triggerRef={inputRef}
            // popoverRef={popoverRef}
            isNonModal
            placement="bottom start"
          >
            <ListBox
              {...mergeProps(props, listBoxProps)}
              // state={state}
              // listBoxRef={listBoxRef}
            />
          </Popover>
        )}
      </div>
    </div>
  );
};
