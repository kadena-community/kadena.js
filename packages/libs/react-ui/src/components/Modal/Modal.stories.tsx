import { IModalProps } from './Modal';
import { ModalProvider } from './ModalProvider';
import { Content } from './StoryComponents';

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
        <div id="modalportal" />
        <ModalProvider>
          <Content />
        </ModalProvider>
      </>
    );
  },
};
