import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

import { IModalProps, Modal } from './Modal';
import { ModalProvider, useModal } from './ModalProvider';

import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';

const meta: Meta<IModalProps> = {
  title: 'Layout/Modal',
  argTypes: {},
};

export default meta;
type Story = StoryObj<IModalProps>;

export const ModalContent = () => {
  return (
    <>
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
    </>
  );
};

export const Content = () => {
  const { renderModal } = useModal();

  return (
    <>
      <Button onClick={() => renderModal(<ModalContent />)} title="openModal">
        Open modal
      </Button>
    </>
  );
};

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
