import { useSelectableItem } from '@react-aria/selection';
import { mergeProps, useId } from '@react-aria/utils';
import type {
  DOMAttributes,
  LongPressEvent,
  Node,
  PressEvent,
} from '@react-types/shared';
import type { ButtonHTMLAttributes, RefObject } from 'react';
import { useButton } from 'react-aria';
import type { TreeState } from 'react-stately';
import {
  isNonContiguousSelectionModifier,
  isCtrlKeyPressed,
} from '../../utils/aria';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface AccordionItemAria {
  /** Props for the accordion item button. */
  buttonProps: ButtonHTMLAttributes<HTMLElement>;
  /** Props for the accordion item content element. */
  regionProps: DOMAttributes;
}

//TODO: Replace with `useAccordionItem` from @react-aria/accordion when it is fixed.
export function useAccordionItem<T>(
  item: Node<T>,
  state: TreeState<T>,
  ref: RefObject<HTMLButtonElement>,
): AccordionItemAria {
  const key = item.key;
  const manager = state.selectionManager;
  const buttonId = useId();
  const regionId = useId();
  const isDisabled = state.disabledKeys.has(key);

  const { itemProps } = useSelectableItem({
    selectionManager: manager,
    key,
    ref,
  });

  const onSelect = (e: PressEvent | LongPressEvent | PointerEvent) => {
    if (e.pointerType === 'keyboard' && isNonContiguousSelectionModifier(e)) {
      manager.toggleSelection(key);
    } else {
      if (manager.selectionMode === 'none') {
        return;
      }

      if (manager.selectionMode === 'single') {
        if (manager.isSelected(key) && !manager.disallowEmptySelection) {
          manager.toggleSelection(key);
        } else {
          manager.replaceSelection(key);
        }
      } else if (e && e.shiftKey) {
        manager.extendSelection(key);
      } else if (
        manager.selectionBehavior === 'toggle' ||
        (e &&
          (isCtrlKeyPressed(e) ||
            e.pointerType === 'touch' ||
            e.pointerType === 'virtual'))
      ) {
        // if touch or virtual (VO) then we just want to toggle, otherwise it's impossible to multi select because they don't have modifier keys
        manager.toggleSelection(key);
      } else {
        manager.replaceSelection(key);
      }
    }
  };

  const { buttonProps } = useButton(
    mergeProps(itemProps as any, {
      id: buttonId,
      elementType: 'button',
      isDisabled,
      onPress: onSelect,
    }),
    ref,
  );

  const isExpanded = state.selectionManager.isSelected(key);

  return {
    buttonProps: {
      ...buttonProps,
      'aria-expanded': isExpanded,
      'aria-controls': isExpanded ? regionId : undefined,
    },
    regionProps: {
      id: regionId,
      role: 'region',
      'aria-labelledby': buttonId,
    },
  };
}
