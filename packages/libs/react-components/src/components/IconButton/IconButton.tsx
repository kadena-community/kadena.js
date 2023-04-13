import { styled } from '../../styles';
import { SystemIcons } from '../Icons';

import React, { FC } from 'react';

export interface IIConButtonProps {
  icon: typeof SystemIcons[keyof typeof SystemIcons];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'transparent',
  width: '$11',
  height: '$11',
  border: 0,
  color: 'inherit',
  cursor: 'pointer',
  transition: 'opacity .2s ease',
  '&:hover': {
    opacity: '.6',
  },
});

export const IconButton: FC<IIConButtonProps> = ({ icon, onClick }) => {
  const Icon = icon;
  return (
    <Button onClick={onClick}>
      <Icon size="md" />
    </Button>
  );
};
