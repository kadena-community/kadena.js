import { isAppleDevice, isMac } from '@react-aria/utils';

interface IEvent {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

export function isNonContiguousSelectionModifier(e: IEvent) {
  // Ctrl + Arrow Up/Arrow Down has a system wide meaning on macOS, so use Alt instead.
  // On Windows and Ubuntu, Alt + Space has a system wide meaning.
  return isAppleDevice() ? e.altKey : e.ctrlKey;
}

export function isCtrlKeyPressed(e: IEvent) {
  if (isMac()) {
    return e.metaKey;
  }

  return e.ctrlKey;
}
