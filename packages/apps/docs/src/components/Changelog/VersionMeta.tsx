import { Heading, Stack } from '@kadena/react-ui';
import { format } from 'date-fns';
import type { FC } from 'react';
import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import {
  contributorListClass,
  contributorsHeaderClass,
  versionMetaWrapperClass,
} from './styles.css';

interface IProps {
  version: IChangelogPackageVersion;
}

export const VersionMeta: FC<IProps> = ({ version }) => {
  return (
    <Stack
      flexDirection={{ xs: 'row', lg: 'column' }}
      gap="xl"
      alignItems={{ xs: 'center', lg: 'flex-start' }}
      className={versionMetaWrapperClass}
    >
      <Heading as="h4" variant="h6">
        {version.date ? format(new Date(version.date), 'PP') : '-'}
      </Heading>

      {version.authors.length > 0 && (
        <Stack
          flexDirection="column"
          flex={1}
          paddingInlineEnd={{ xs: 'xs', lg: 'no' }}
        >
          <Heading as="h4" variant="h6" className={contributorsHeaderClass}>
            Contributors
          </Heading>
          <Stack as="ul" className={contributorListClass} gap="xs">
            {version.authors.map((author) => (
              <Avatar
                key={author.login}
                avatar={author.avatar_url}
                name={author.login}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
