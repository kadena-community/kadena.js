import { Heading, Stack } from '@kadena/react-ui';
import { format } from 'date-fns';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  version: IChangelogPackageVersion;
}

export const VersionMeta: FC<IProps> = ({ version }) => {
  return (
    <Stack flexDirection="column" gap="xl">
      <Heading as="h4" variant="h5">
        {version.date ? format(new Date(version.date), 'PP') : '-'}
      </Heading>

      {version.authors.length > 0 && (
        <Stack flexDirection="column">
          <Heading as="h4" variant="h5">
            Contributors
          </Heading>
          <ul>
            {version.authors.map((author) => (
              <li key={author.id}>{author.login}</li>
            ))}
          </ul>
        </Stack>
      )}
    </Stack>
  );
};
