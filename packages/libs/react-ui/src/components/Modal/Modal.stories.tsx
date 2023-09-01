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
          'The component library exposes a `ModalProvider` and `useModal` hook that can be used with an element with id "modalportal" to display content in a modal.<br><br>To render a modal you need to add `<div id="modalportal" />` as the last child of the document body and wrap your content in the `ModalProvider` component. Then you can pass jsx and a title to the `renderModal` function from the `useModal` hook to render content in the modal.<br><br>See the code for this story for an example.',
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
