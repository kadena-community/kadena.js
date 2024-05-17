import { getVersions } from '@/scripts/importChangelogs/utils/misc';
import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Version } from './Version';
import { VersionMeta } from './VersionMeta';
import { backgroundClass, versionsSectionClass } from './styles.css';

interface IProps {
  pkg: IChangelogPackage;
}

export const Package: FC<IProps> = ({ pkg }) => {
  return (
    <Stack
      as="section"
      width="100%"
      className={backgroundClass}
      flexDirection="column"
      padding="xxxl"
      gap="lg"
    >
      <Heading as="h2">{pkg.name}</Heading>
      {getVersions(pkg).map((version) => (
        <Stack key={version.label}>
          <Stack paddingBlock="lg" paddingInlineEnd="xxxl">
            <VersionMeta version={version} />
          </Stack>
          <Stack
            flex={1}
            className={versionsSectionClass}
            paddingInlineStart={{ xs: 'md', xl: 'xxxl' }}
            paddingInlineEnd="md"
            paddingBlock="lg"
            flexDirection="column"
            gap="lg"
          >
            <Version version={version} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
