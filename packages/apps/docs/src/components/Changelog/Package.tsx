import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Version } from './Version';
import { VersionMeta } from './VersionMeta';
import { backgroundClass, versionsSectionClass } from './styles.css';

export const Package: FC = () => {
  return (
    <Stack
      as="section"
      width="100%"
      className={backgroundClass}
      flexDirection="column"
      padding="xxxl"
      gap="lg"
    >
      <Heading as="h2">Pact</Heading>

      <Stack>
        <Stack paddingBlock="lg" paddingInlineEnd="xxxl">
          <VersionMeta />
        </Stack>
        <Stack
          flex={1}
          className={versionsSectionClass}
          paddingInline="xxxl"
          paddingBlock="lg"
          flexDirection="column"
          gap="lg"
        >
          <Version label="4.1.1" />
        </Stack>
      </Stack>

      <Stack>
        <Stack paddingBlock="lg" paddingInlineEnd="xxxl">
          <VersionMeta />
        </Stack>
        <Stack
          flex={1}
          className={versionsSectionClass}
          paddingInline="xxxl"
          paddingBlock="lg"
          flexDirection="column"
          gap="lg"
        >
          <Version label="4.1.1" />
        </Stack>
      </Stack>
    </Stack>
  );
};
