import type { DOMAttributes } from '@react-types/shared';
import { createContext } from 'react';
import type { OverlayTriggerState } from 'react-stately';

export interface IDialogContext {
  titleProps: DOMAttributes;
  state: OverlayTriggerState;
}

export const DialogContext = createContext<IDialogContext>({
  titleProps: {},
  state: {
    isOpen: false,
    setOpen: (isOpen: boolean) => {},
    open: () => {},
    close: () => {},
    toggle: () => {},
  },
});
