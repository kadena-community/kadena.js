import { config, styled } from '../../styles';
import { SystemIcons } from '../Icons';

import { PropertyValue } from '@stitches/react';
import React, { FC } from 'react';

export interface IIconButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'> {
  icon: typeof SystemIcons[keyof typeof SystemIcons];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: string;
  color?: PropertyValue<'backgroundColor', typeof config>;
}

const Button = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'transparent',
  borderRadius: '$lg',
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

export const IconButton: FC<IIconButtonProps> = ({
  icon,
  onClick,
  color = 'transparent',
  ...props
}) => {
  const Icon = icon;
  const ariaLabel = props['aria-label'] ?? props.title;

  return (
    <Button
      onClick={onClick}
      {...props}
      aria-label={ariaLabel}
      css={{ backgroundColor: color }}
    >
      <Icon size="md" />
    </Button>
  );
};
