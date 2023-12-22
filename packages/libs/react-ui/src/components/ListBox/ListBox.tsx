import type { RefObject } from 'react';
import React, { useRef } from 'react';
import type {
  AriaComboBoxOptions,
  AriaListBoxProps,
  AriaOptionProps,
} from 'react-aria';
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

  let backgroundColor;
  let color = 'black';

  if (isSelected) {
    backgroundColor = 'blueviolet';
    color = 'white';
  } else if (isFocused) {
    backgroundColor = 'gray';
  } else if (isDisabled) {
    backgroundColor = 'transparent';
    color = 'gray';
  }

  return (
    <li
      {...optionProps}
      ref={ref}
      style={{
        background: backgroundColor,
        color: color,
        padding: '2px 5px',
        outline: 'none',
        cursor: 'pointer',
      }}
    >
      {item.rendered}
    </li>
  );
};

// interface IListBoxSectionProps<T> {
//   section: Node<object>;
//   state: ListState<T>;
// }

// // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// const ListBoxSection = <T extends object>({
//   section,
//   state,
// }: IListBoxSectionProps<T>) => {
//   const { itemProps, headingProps, groupProps } = useListBoxSection({
//     heading: section.rendered,
//     'aria-label': section['aria-label'],
//   });

//   // If the section is not the first, add a separator element to provide visual separation.
//   // The heading is rendered inside an <li> element, which contains
//   // a <ul> with the child items.
//   return (
//     <>
//       {section.key !== state.collection.getFirstKey() && (
//         <li
//           role="presentation"
//           style={{
//             borderTop: '1px solid gray',
//             margin: '2px 5px',
//           }}
//         />
//       )}
//       <li {...itemProps}>
//         {section.rendered && (
//           <span
//             {...headingProps}
//             style={{
//               fontWeight: 'bold',
//               fontSize: '1.1em',
//               padding: '2px 5px',
//             }}
//           >
//             {section.rendered}
//           </span>
//         )}
//         <ul
//           {...groupProps}
//           style={{
//             padding: 0,
//             listStyle: 'none',
//           }}
//         >
//           {[...section.childNodes].map((node) => (
//             <Option key={node.key} item={node} state={state} />
//           ))}
//         </ul>
//       </li>
//     </>
//   );
// };

// // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export const ListBox = <T extends object>(props: IListBoxProps<T>) => {
//   // Create state based on the incoming props
//   const state = useListState(props);

//   // Get props for the listbox element
//   const ref = useRef(null);
//   const { listBoxProps, labelProps } = useListBox(props, state, ref);

//   return (
//     <>
//       <div {...labelProps}>{props.label}</div>
//       <ul {...listBoxProps} ref={ref}>
//         {[...state.collection].map((item) =>
//           item.type === 'section' ? (
//             <ListBoxSection key={item.key} section={item} state={state} />
//           ) : (
//             <Option key={item.key} item={item} state={state} />
//           ),
//         )}
//       </ul>
//     </>
//   );
// };

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
