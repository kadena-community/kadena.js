import { getVersions } from '@/scripts/importChangelogs/utils/misc';
import { MonoAdd, MonoList } from '@kadena/react-icons/system';
import { Heading, Stack, Link as UILink } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Version } from './Version';
import { VersionMeta } from './VersionMeta';
import {
  backgroundClass,
  togglePackageButtonClass,
  togglePackageIconClass,
  togglePackageIconOpenClass,
  versionWrapperClass,
  versionWrapperOpenClass,
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
      gap="lg"
    >
      <Stack alignItems="center" width="100%" justifyContent="space-between">
        <Stack>
          {!isFullPage ? (
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
          ) : (
            <Heading as="h2">{pkg.name}</Heading>
          )}
        </Stack>

        {!isFullPage && (
          <UILink
            href={`/changelogs/${pkg.slug}`}
            variant="transparent"
            endVisual={<MonoList />}
          >
            See all logs
          </UILink>
        )}
      </Stack>
      <Stack
        ref={ref}
        flexDirection="column"
        gap="lg"
        className={classNames(versionWrapperClass, {
          [versionWrapperOpenClass]: !isOpen,
        })}
      >
        {getVersions(pkg).map((version) => (
          <Stack
            key={version.label}
            flexDirection={{ xs: 'column', lg: 'row' }}
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
      </Stack>
    </Stack>
  );
};
