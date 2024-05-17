import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { CommitItem } from './CommitItem';
import { commitListClass } from './styles.css';

interface IProps {
  label: string;
  commits: IChangelogVersionRecord[];
}

export const Commits: FC<IProps> = ({ label, commits }) => {
  if (!commits.length) return;
  return (
    <Stack width="100%" flexDirection="column" gap="sm">
      <Heading as="h4" variant="h5">
        {label}
      </Heading>
      <Stack as="ul" className={commitListClass} flexDirection="column">
        {commits.map((commit) => (
          <CommitItem key={commit.label} commit={commit} />
        ))}
      </Stack>
    </Stack>
  );
};
