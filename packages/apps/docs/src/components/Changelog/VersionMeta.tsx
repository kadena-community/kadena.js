import { Heading, Stack } from '@kadena/kode-ui';
import { format } from 'date-fns';
import Link from 'next/link';
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
          gap="sm"
        >
          <Heading as="h4" variant="h6" className={contributorsHeaderClass}>
            Contributors
          </Heading>
          <Stack as="ul" className={contributorListClass} gap="xs">
            {version.authors.map((author) => (
              <Link
                rel="noreferrer"
                target="_blank"
                key={author.login}
                href={author.html_url ?? '#'}
              >
                <Avatar avatar={author.avatar_url} name={author.login} />
              </Link>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
