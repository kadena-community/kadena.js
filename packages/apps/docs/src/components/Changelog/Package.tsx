import { getVersions } from '@/scripts/importChangelogs/utils/misc';
import { MonoAdd, MonoList } from '@kadena/react-icons/system';
import { Button, Heading, Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';
import { Version } from './Version';
import { VersionMeta } from './VersionMeta';
import {
  backgroundClass,
  togglePackageButtonClass,
  togglePackageIconClass,
  togglePackageIconOpenClass,
  versionsSectionClass,
  versionsSectionMetaClass,
} from './styles.css';

interface IProps {
  pkg: IChangelogPackage;
}

export const Package: FC<IProps> = ({ pkg }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = (): void => {
    setIsOpen((v) => !v);
  };
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
      <Stack alignItems="center" width="100%" justifyContent="space-between">
        <Stack>
          <button onClick={handleOpen} className={togglePackageButtonClass}>
            <span
              className={classNames(togglePackageIconClass, {
                [togglePackageIconOpenClass]: isOpen,
              })}
            >
              <MonoAdd />
            </span>
            <Heading as="h2">{pkg.name}</Heading>
          </button>
        </Stack>

        <Link href={`/changelogs/${pkg.slug}`}>
          <Button variant="transparent" endVisual={<MonoList />}>
            See all logs
          </Button>
        </Link>
      </Stack>
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
