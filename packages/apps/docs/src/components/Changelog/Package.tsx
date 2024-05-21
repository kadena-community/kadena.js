import { getVersions } from '@/scripts/importChangelogs/utils/misc';
import { Heading, Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Version } from './Version';
import { VersionMeta } from './VersionMeta';
import {
  backgroundClass,
  versionsSectionClass,
  versionsSectionMetaClass,
} from './styles.css';

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
      paddingBlock="xxxl"
      paddingInline={{ xs: 'md', md: 'xl', lg: 'xxxl' }}
      gap="lg"
    >
      <Heading as="h2">{pkg.name}</Heading>
      {getVersions(pkg).map((version) => (
        <Stack key={version.label} flexDirection={{ xs: 'column', lg: 'row' }}>
          <Stack
            paddingBlock="lg"
            className={versionsSectionMetaClass}
            paddingInlineEnd={{ xs: 'no', lg: 'xl' }}
          >
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
