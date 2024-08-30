import React from 'react';
import { Stack } from '../../components';
import { footerGroup } from './CardPattern.css';

export interface ICardFooterGroupProps {
  children: React.ReactNode;
  separated?: boolean;
}

export const CardFooterGroup = ({
  children,
  separated = false,
}: ICardFooterGroupProps) => {
  return (
    <Stack
      className={footerGroup}
      marginBlockStart="xxl"
      gap="md"
      justifyContent={separated ? 'space-between' : 'flex-end'}
    >
      {children}
    </Stack>
  );
};
