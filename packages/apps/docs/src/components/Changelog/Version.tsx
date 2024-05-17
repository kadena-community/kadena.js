import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Commits } from './Commits';

interface IProps {
  label: string;
}

export const Version: FC<IProps> = ({ label }) => {
  return (
    <Stack flexDirection="column" gap="lg">
      <Heading as="h3" variant="h3">
        4.11.0
      </Heading>
      <Commits label="Features" />
      <Commits label="Bugfixes" />
      <Commits label="Misc" />
    </Stack>
  );
};
