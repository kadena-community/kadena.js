import { MonoArrowBackIosNew } from '@kadena/react-icons';
import { Box, Stack } from '@kadena/react-ui';
import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { authCard, backBtnClass, iconStyle } from './style.css.ts';

interface IProps {
  children: ReactNode;
}

export const AuthCard: FC<IProps> = ({ children }) => {
  return (
    <Box className={authCard}>
      <Link to="/select-profile" className={backBtnClass}>
        <Stack alignItems="center" gap="xs" paddingBlockEnd="md">
          <MonoArrowBackIosNew className={iconStyle} /> Back
        </Stack>
      </Link>
      {children}
    </Box>
  );
};
