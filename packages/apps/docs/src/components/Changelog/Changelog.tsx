import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Commits } from './Commits';
import { commitsSectionClass } from './styles.css';

export const Changelog: FC = () => {
  return (
    <Stack as="section" width="100%">
      <Stack>sdf</Stack>
      <Stack
        flex={1}
        className={commitsSectionClass}
        paddingInline="xxxl"
        paddingBlock="lg"
        flexDirection="column"
        gap="lg"
      >
        <Heading as="h2" variant="h3">
          4.11.0
        </Heading>
        <Commits label="Features" />
        <Commits label="Bugfixes" />
        <Commits label="Misc" />
      </Stack>
    </Stack>
  );
};
