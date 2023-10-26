import type { DOMProps } from '@react-types/shared';

import type { AriaButtonProps } from 'react-aria';
import { useOverlayTrigger } from 'react-aria';
import type { OverlayTriggerProps, OverlayTriggerState } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';

interface IModalReturn {
  triggerProps: Omit<AriaButtonProps, 'onPress'> & {
    onClick?: () => void;
  };
  modalProps: OverlayTriggerState & DOMProps;
}

export const useModal = (props?: OverlayTriggerProps): IModalReturn => {
  const state = useOverlayTriggerState(props || {});
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
  );

  return {
    triggerProps: {
      ...triggerProps,
      // NOTE: Currently we are not using react-aria for our button so we cannot use onPress
      onClick: () => (state.isOpen ? state.close() : state.open()),
    },
    modalProps: { ...state, ...overlayProps },
  };
};
