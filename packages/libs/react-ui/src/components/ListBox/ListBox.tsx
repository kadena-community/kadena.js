import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, ReactNode, Ref } from 'react';
import React, { forwardRef } from 'react';
import type { AriaListBoxOptions } from 'react-aria';
import { useListBox } from 'react-aria';
import type { ListState } from 'react-stately';
import { listBoxClass } from './ListBox.css';
import { ListBoxOption } from './ListBoxOption';

interface IListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  state: ListState<T>;
  label?: ReactNode;
}

function ListBoxBase<T extends object>(
  props: IListBoxProps<T>,
  forwardedRef: ForwardedRef<HTMLUListElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const { state } = props;
  const { listBoxProps, labelProps } = useListBox(props, state, ref);

  return (
    <>
      {props.label && <div {...labelProps}>{props.label}</div>}
      <ul
        {...listBoxProps}
        ref={ref}
        data-scrollable="true"
        className={listBoxClass}
      >
        {[...state.collection].map((item) => (
          <ListBoxOption key={item.key} item={item} state={state} />
        ))}
      </ul>
    </>
  );
}

export const ListBox = forwardRef(ListBoxBase) as <T extends object>(
  props: IListBoxProps<T> & { ref?: Ref<HTMLUListElement> },
) => JSX.Element;
