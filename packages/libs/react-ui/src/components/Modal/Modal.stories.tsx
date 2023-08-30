import { Content } from './StoryComponents';

import { IModalProps, ModalProvider } from '@components/Modal';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{ title?: string } & IModalProps> = {
  title: 'Layout/Modal',
  parameters: {
    docs: {
      description: {
        component:
          'Component which informs user about a task and it may sometimes contain important information, require decision making, or involve tasks for the user.',
      },
    },
  },
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      description: 'Title of the modal.',
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
