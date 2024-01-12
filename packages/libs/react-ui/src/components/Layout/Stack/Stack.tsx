import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { IBoxProps } from '../Box';
import { Box } from '../Box';

export interface IStackProps extends IBoxProps {
  display?: 'flex' | 'inline-flex';
}

const BaseStack = (
  { children, as = 'div', display = 'flex', ...props }: IStackProps,
  ref: ForwardedRef<HTMLElement>,
): React.ReactElement => {
  return (
    <Box ref={ref} as={as} display={display} {...props}>
      {children}
    </Box>
  );
};

export const Stack = forwardRef(BaseStack);
