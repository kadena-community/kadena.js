import { MonoArrowBackIosNew } from '@kadena/react-icons';
import { Box, Stack } from '@kadena/react-ui';
import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { authCard, backButtonClass, iconStyle } from './style.css.ts';

interface IProps {
  children: ReactNode;
  backButtonLink: string;
}

export const AuthCard: FC<IProps> = ({ children, backButtonLink }) => {
  return (
    <Box className={authCard}>
      <Link to={backButtonLink} className={backButtonClass}>
        <Stack alignItems="center" gap="xs" paddingBlockEnd="md">
          <MonoArrowBackIosNew className={iconStyle} /> Back
        </Stack>
      </Link>
      {children}
    </Box>
  );
};
