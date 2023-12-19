import type { FC } from 'react';
import React from 'react';
import type { IBoxProps } from '../Box';
import { Box } from '../Box';

export interface IStackProps extends IBoxProps {
  display?: 'flex' | 'inline-flex';
}

export const Stack: FC<IStackProps> = ({
  children,
  as = 'div',
  display = 'flex',
  ...props
}) => {
  return (
    <Box as={as} display={display} {...props}>
      {children}
    </Box>
  );
};
