import { Content } from './StoryComponents';

import type { IModalProps } from '@components/Modal';
import { ModalProvider } from '@components/Modal';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{ title?: string } & IModalProps> = {
  title: 'Layout/Modal',
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<{ title?: string } & IModalProps>;

export const Primary: Story = {
  name: 'Modal',
  args: {
    title: 'Default Title',
  },
  render: ({ title }) => {
    return (
      <>
        <div id="modalportal" />
        <ModalProvider>
          <Content title={title} />
        </ModalProvider>
      </>
    );
  },
};
