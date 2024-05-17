import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Commits } from './Commits';

interface IProps {
  version: IChangelogPackageVersion;
}

export const Version: FC<IProps> = ({ version }) => {
  return (
    <Stack flexDirection="column" gap="lg">
      <Heading as="h3" variant="h3">
        {version.label}
      </Heading>

      <Commits label="Minors" commits={version.minors} />
      <Commits label="Patches" commits={version.patches} />
      <Commits label="Misc" commits={version.miscs} />
    </Stack>
  );
};
