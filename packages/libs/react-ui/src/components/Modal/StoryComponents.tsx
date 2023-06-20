import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

import { useModal } from './ModalProvider';

import React from 'react';

const ModalContent = () => {
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
