import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { CommitItem } from './CommitItem';
import { commitListClass } from './styles.css';

interface IProps {
  label: string;
}

export const Commits: FC<IProps> = ({ label }) => {
  return (
    <Stack width="100%" flexDirection="column" gap="sm">
      <Heading as="h4" variant="h5">
        {label}
      </Heading>
      <Stack as="ul" className={commitListClass} flexDirection="column">
        <CommitItem commitCount={1} />
        <CommitItem commitCount={1} />
        <CommitItem commitCount={4} />
        <CommitItem commitCount={2} />
      </Stack>
    </Stack>
  );
};
