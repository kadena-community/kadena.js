import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

import { IModalProps, Modal } from './Modal';
import { ModalProvider } from './ModalProvider';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<IModalProps> = {
  title: 'Layout/Modal',
  argTypes: {},
};

export default meta;
type Story = StoryObj<IModalProps>;

export const Primary: Story = {
  name: 'Modal',
  args: {},
  render: () => {
    return (
      <>
        <ModalProvider>
          <Modal>
            <Card fullWidth={true}>
              <h4>Getting Started is Simple</h4>
              <div>
                Learn Kadena&apos;s core concepts & tools for development in 15
                minutes
              </div>
            </Card>
            <Card fullWidth={true}>
              <h4>Getting Started is Simple</h4>
              <div>
                Learn Kadena&apos;s core concepts & tools for development in 15
                minutes
              </div>
            </Card>
          </Modal>
        </ModalProvider>
      </>
    );
  },
};
