import { isAppleDevice, isMac } from '@react-aria/utils';
import type { ReactNode } from 'react';

interface Event {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

export function isNonContiguousSelectionModifier(e: Event) {
  // Ctrl + Arrow Up/Arrow Down has a system wide meaning on macOS, so use Alt instead.
  // On Windows and Ubuntu, Alt + Space has a system wide meaning.
  return isAppleDevice() ? e.altKey : e.ctrlKey;
}

export function isCtrlKeyPressed(e: Event) {
  if (isMac()) {
    return e.metaKey;
  }

  return e.ctrlKey;
}

interface IAriaLabelingProps {
  label?: ReactNode;
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

export function fixAriaLabeling<T extends IAriaLabelingProps>(
  props: T,
  component: string,
) {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (props.label && (props['aria-labelledby'] || props['aria-label'])) {
    console.warn(
      `${component}: You should not provide both 'label' and 'aria-labelledby' or 'aria-label', 'label' will be used.`,
    );
    props['aria-labelledby'] = undefined;
    props['aria-label'] = undefined;
  }
  return props;
}
