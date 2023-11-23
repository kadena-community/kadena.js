import type { DOMAttributes } from '@react-types/shared';
import { createContext } from 'react';
import type { OverlayTriggerState } from 'react-stately';

export interface IDialogContext extends OverlayTriggerState {
  titleProps: DOMAttributes;
}
export const DialogContext = createContext<IDialogContext>({
  titleProps: {},
  isOpen: false,
  setOpen: (isOpen: boolean) => {},
  open: () => {},
  close: () => {},
  toggle: () => {},
});
