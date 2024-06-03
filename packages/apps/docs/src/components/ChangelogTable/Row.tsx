import { Badge, Grid, GridItem, Stack, Tooltip } from '@kadena/react-ui';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { cellClass, dateClass, listClass, trClass } from './styles.css';

interface IProps {
  pkg: IChangelogPackage;
}

export const Row: FC<IProps> = ({ pkg }) => {
  const version = pkg.content[0];
  return (
    <Link href={`/changelogs/${pkg.slug}`}>
      <Grid
        width="100%"
        columns={{ xs: 3, lg: 5 }}
        gap={{ xs: 'no', lg: 'md' }}
        className={trClass}
      >
        <GridItem className={cellClass}>{pkg.name}</GridItem>
        <GridItem className={cellClass}>{version.label}</GridItem>
        <GridItem className={cellClass}>
          <Stack
            width="100%"
            justifyContent={{ xs: 'flex-end', lg: 'flex-start' }}
            className={dateClass}
          >
            {formatDistanceToNow(new Date(version.date ?? 0))} ago
          </Stack>
        </GridItem>
        <GridItem columnSpan={{ xs: 1 / 1, lg: 1 }} className={cellClass}>
          <Stack gap="sm" alignItems="center">
            <Tooltip
              position="top"
              content="patches"
              delay={500}
              closeDelay={300}
              defaultOpen={false}
              isDisabled={false}
            >
              <Stack>
                <Badge size="sm" style="info" ariaLabel="patches">
                  {version.patches.length > 0 ? version.patches.length : '-'}
                </Badge>
              </Stack>
            </Tooltip>
            <Tooltip
              position="top"
              content="minor updates"
              delay={500}
              closeDelay={300}
              defaultOpen={false}
              isDisabled={false}
            >
              <Stack>
                <Badge size="sm" style="warning" ariaLabel="minor updates">
                  {version.minors.length > 0 ? version.minors.length : '-'}
                </Badge>
              </Stack>
            </Tooltip>

            <Tooltip
              position="top"
              content="miscellaneous"
              delay={500}
              closeDelay={300}
              defaultOpen={false}
              isDisabled={false}
            >
              <Stack>
                <Badge size="sm" style="default" ariaLabel="miscellaneous">
                  {version.miscs.length > 0 ? version.miscs.length : '-'}
                </Badge>
              </Stack>
            </Tooltip>
          </Stack>
        </GridItem>
        <GridItem columnSpan={{ xs: 2 / 1, lg: 1 }}>
          <Stack
            as="ul"
            className={listClass}
            justifyContent="flex-end"
            gap="sm"
          >
            {version.authors.map((author) => (
              <li key={author.login}>
                <Avatar name={author.login} avatar={author.avatar_url} />
              </li>
            ))}
          </Stack>
        </GridItem>
      </Grid>
    </Link>
  );
};
