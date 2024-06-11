import { MonoArrowBackIosNew } from '@kadena/react-icons';
import { Box, Button, Stack } from '@kadena/react-ui';
import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authCard, backButtonClass, iconStyle } from './style.css.ts';

interface IProps {
  children: ReactNode;
}

export const AuthCard: FC<IProps> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <Box className={authCard}>
      <Stack paddingBlockEnd="md">
        <Button
          variant="transparent"
          onPress={() => navigate(-1)}
          className={backButtonClass}
        >
          <Stack alignItems="center" gap="xs">
            <MonoArrowBackIosNew className={iconStyle} /> Back
          </Stack>
        </Button>
      </Stack>
      {children}
    </Box>
  );
};
