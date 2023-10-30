import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '../Button';
import type { IModalProps } from '../Modal';
import { Modal } from './Modal';
import { ModalContent } from './StoryComponents';

import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';

const meta: Meta<{ title?: string } & IModalProps> = {
  title: 'Overlays/Modal',
  parameters: {
    status: {
      type: ['inDevelopment'],
    },
    docs: {
      description: {
        component:
          'This is a generic modal component that can be used to render any content inside a modal., if you want to render a modal with a specific layout, you can use the `Dialog` component.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IModalProps>;

export const Primary: Story = {
  name: 'Modal',
  render: () => {
    const state = useOverlayTriggerState({});
    const { triggerProps, overlayProps } = useOverlayTrigger(
      { type: 'dialog' },
      state,
    );

    return (
      <>
        <Button
          {...triggerProps}
          onClick={() => {
            state.open();
          }}
        >
          Modal Trigger
        </Button>
        <Modal {...overlayProps} state={state}>
          {(ariaModalProps, ref) => (
            <div
              ref={ref}
              {...ariaModalProps}
              style={{
                width: '70%',
                backgroundColor: 'white',
                padding: 20,
              }}
            >
              <ModalContent />
              <Button onClick={state.close}>Close Button</Button>
            </div>
          )}
        </Modal>
      </>
    );
  },
};
