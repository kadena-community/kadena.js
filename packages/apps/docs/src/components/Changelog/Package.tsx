import { getVersions } from '@/scripts/importChangelogs/utils/misc';
import { MonoKeyboardArrowRight, MonoList } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Version } from './Version';
import { VersionMeta } from './VersionMeta';
import {
  backgroundClass,
  pkgWrapperClass,
  pkgWrapperOpenClass,
  togglePackageButtonClass,
  togglePackageIconClass,
  togglePackageIconOpenClass,
  versionsSectionClass,
  versionsSectionMetaClass,
} from './styles.css';

interface IProps {
  pkg: IChangelogPackage;
  isFullPage?: boolean;
}

export const Package: FC<IProps> = ({ pkg, isFullPage = true }) => {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || isFullPage) return;

    ref.current.style.maxHeight = isOpen
      ? `${ref.current.scrollHeight + 1000}px`
      : '0';
  }, [ref.current, isOpen, isFullPage]);

  const versions = useMemo(() => {
    return getVersions(pkg);
  }, [pkg.content]);

  const handleOpen = (): void => {
    if (isFullPage) return;
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
    >
      <Stack alignItems="center" width="100%" justifyContent="space-between">
        {!isFullPage ? (
          <button onClick={handleOpen} className={togglePackageButtonClass}>
            <Heading as="h2">{pkg.name}</Heading>

            <Text
              className={classNames(togglePackageIconClass, {
                [togglePackageIconOpenClass]: isOpen,
              })}
            >
              <MonoKeyboardArrowRight />
            </Text>
          </button>
        ) : (
          <Heading as="h2">{pkg.name}</Heading>
        )}
      </Stack>
      <Stack
        ref={ref}
        flexDirection="column"
        gap="lg"
        className={classNames(pkgWrapperClass, {
          [pkgWrapperOpenClass]: !isOpen,
        })}
      >
        {versions.map((version) => (
          <Stack
            key={version.label}
            flexDirection={{ xs: 'column', lg: 'row' }}
            paddingBlockStart="lg"
          >
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
        {!isFullPage && (pkg.versionCount ?? 0) > versions.length && (
          <Stack width="100%" justifyContent="flex-start">
            <Link href={`/changelogs/${pkg.slug}`} passHref legacyBehavior>
              <Button variant="info" endVisual={<MonoList />}>
                See all logs
              </Button>
            </Link>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
