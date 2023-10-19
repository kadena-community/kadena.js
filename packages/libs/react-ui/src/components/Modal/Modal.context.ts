import { createContext } from 'react';
import type { AriaButtonProps, DOMProps } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';

interface IModalContext {
  state?: OverlayTriggerState;
  overlayProps: DOMProps;
  triggerProps: AriaButtonProps<'button'>;
}

export const ModalContext = createContext<IModalContext>({
  state: undefined,
  overlayProps: {},
  triggerProps: {},
});
