import { useFreeze } from '@/hooks/freeze';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { InvestorBalance } from '../InvestorBalance/InvestorBalance';

interface IProps {
  investorAccount: string;
}

export const InvestorInfo: FC<IProps> = ({ investorAccount }) => {
  const { frozen } = useFreeze({ investorAccount });

  return (
    <Stack width="100%" flexDirection="column">
      <Heading as="h3">investor: {investorAccount}</Heading>
      <Stack width="100%" alignItems="center" gap="md">
        <Button isDisabled>
          {frozen ? (
            <Stack gap="sm" alignItems="center">
              <MonoPause />
              frozen
            </Stack>
          ) : (
            <Stack gap="sm" alignItems="center">
              <MonoPlayArrow />
              active
            </Stack>
          )}
        </Button>

        <InvestorBalance investorAccount={investorAccount} />
      </Stack>
    </Stack>
  );
};
