import type { IModalRootProps } from '@components/Modal';
import { Modal } from '@components/Modal';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type StoryType = { title?: string } & IModalRootProps;

const meta: Meta<StoryType> = {
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
type Story = StoryObj<StoryType>;

export const Primary: Story = {
  name: 'Modal',
  args: {
    title: 'Default Title',
  },
  render: ({ title }) => {
    return (
      <Modal.Root>
        <Modal.Trigger>Modal Trigger</Modal.Trigger>
        <Modal.Content title={title}>
          Hellooo, . .adsflsjflka jf;ljas f;as flas fjl;as fjlasdjf kasldf
          jl;aksdfj l;adskjf lasdf jalsfdj;alf jsldf jalsd fa;lsjd jsdflsjdf
          kldsj fklsdfj lks jflksdjf lkds fjsdlkf dsjf ksdfjsldfj lsdfj sdlf
          dsjlf ks
        </Modal.Content>
      </Modal.Root>
    );
  },
};
