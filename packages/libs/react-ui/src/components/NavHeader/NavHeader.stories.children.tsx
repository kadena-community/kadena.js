import { Button } from '@components/Button';
import React, { FC } from 'react';

export const NavHeaderChildren: FC = () => {
  return (
    <Button
      as="button"
      icon="Link"
      onClick={() => {}}
      title="test title"
      variant="positive"
      style={{ marginLeft: '1rem' }}
    >
      Connect your wallet
    </Button>
  );
};
