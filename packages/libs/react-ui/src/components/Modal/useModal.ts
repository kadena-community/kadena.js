import type { DOMProps } from '@react-types/shared';

import type { AriaButtonProps, PressEvent } from 'react-aria';
import { useOverlayTrigger } from 'react-aria';
import type { OverlayTriggerProps, OverlayTriggerState } from 'react-stately';
import { useOverlayTriggerState } from 'react-stately';

interface IModalReturn {
  triggerProps: Omit<AriaButtonProps, 'onPress'> & {
    onClick?: (e: PressEvent) => void;
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
    triggerProps: { ...triggerProps, onClick: triggerProps.onPress },
    modalProps: { ...state, ...overlayProps },
  };
};
