import className from 'classnames';
import type { RefObject } from 'react';
import React, { useRef } from 'react';
import type { AriaListBoxProps } from 'react-aria';
// import {
//   mergeProps,
//   useFocusRing,
//   useListBox,
//   useListBoxSection,
//   useOption,
// } from 'react-aria';
// import type { ListState, Node } from 'react-stately';
// import { Item, useListState } from 'react-stately';

// interface IOptionProps<T> {
//   item: Node<object>;
//   state: ListState<T>;
// }

import { useListBox, useOption } from 'react-aria';
import type { ListState, Node } from 'react-stately';
import {
  disabledClass,
  focusedClass,
  optionClass,
  selectedClass,
} from './ListBox.css';

interface IOptionProps<T> {
  item: Node<object>;
  state: ListState<T>;
}

// const Option = <T extends object>({ item, state }: IOptionProps<T>) => {
//   // Get props for the option element
//   const ref = useRef(null);
//   const { optionProps } = useOption({ key: item.key }, state, ref);

//   // Determine whether we should show a keyboard
//   // focus ring for accessibility
//   const { isFocusVisible, focusProps } = useFocusRing();

//   return (
//     <li
//       {...mergeProps(optionProps, focusProps)}
//       ref={ref}
//       data-focus-visible={isFocusVisible}
//     >
//       {item.rendered}
//     </li>
//   );
// };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Option = <T extends object>({ item, state }: IOptionProps<T>) => {
  const ref = useRef(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref,
  );

  const classList = className(optionClass, {
    [selectedClass]: isSelected,
    [focusedClass]: isFocused,
    [disabledClass]: isDisabled,
  });

  return (
    <li {...optionProps} ref={ref} className={classList}>
      {item.rendered}
    </li>
  );
};

export interface IListBoxProps<T> extends AriaListBoxProps<T> {
  state: ListState<T>;
  listBoxRef: RefObject<HTMLElement>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ListBox = <T extends object>(props: IListBoxProps<T>) => {
  const ref = React.useRef(null);
  const { listBoxRef = ref, state } = props;
  const { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef as RefObject<HTMLUListElement>}
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        maxHeight: 150,
        overflow: 'auto',
        // width: '100%',
        // minWidth: 200,
      }}
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
};
