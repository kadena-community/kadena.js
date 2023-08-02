import { Button } from '@components/Button';
import React, { FC } from 'react';

export const NavHeaderChildren: FC = () => {
  return (
    <Button
      as="button"
      icon="Link"
      onClick={() => {}}
      style={{ marginLeft: '1rem' }}
      title="test title"
      variant="positive"
    >
      Connect your wallet
    </Button>
  );
};
