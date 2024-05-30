import {
  Badge,
  Grid,
  GridItem,
  Heading,
  Stack,
  Tooltip,
} from '@kadena/react-ui';
import { formatDistanceToNow, isAfter } from 'date-fns';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Avatar } from '../Avatar/Avatar';
import { dateClass, listClass, tableClass, trClass } from './styles.css';

interface IProps {
  changelogs: IChangelogPackage[];
}

export const ChangelogTable: FC<IProps> = ({ changelogs }) => {
  console.log(changelogs);
  const reOrderedChangelog = useMemo(() => {
    return changelogs
      .filter((pkg) => pkg.content)
      .sort((a, b) => {
        if (
          isAfter(
            new Date(a.content[0].date ?? 0),
            new Date(b.content[0].date ?? 0),
          )
        )
          return -1;
        if (
          isAfter(
            new Date(b.content[0].date ?? 0),
            new Date(a.content[0].date ?? 0),
          )
        )
          return 1;
        return 0;
      });
  }, [changelogs]);

  return (
    <Stack flexDirection="column" className={tableClass}>
      {reOrderedChangelog.map((pkg) => {
        const version = pkg.content[0];
        return (
          <Link key={pkg.slug} href={`/changelogs/${pkg.slug}`}>
            <Grid
              width="100%"
              columns={{ xs: 2, lg: 4 }}
              paddingBlock="sm"
              gap={{ xs: 'no', lg: 'md' }}
              className={trClass}
            >
              <GridItem>
                <Stack marginBlockEnd="md">
                  <Heading as="h6" variant="h5">
                    {pkg.name}
                  </Heading>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack
                  width="100%"
                  justifyContent={{ xs: 'flex-end', lg: 'flex-start' }}
                  className={dateClass}
                >
                  {formatDistanceToNow(new Date(version.date ?? 0))} ago
                </Stack>
              </GridItem>
              <GridItem>
                <Stack gap="sm">
                  <Tooltip
                    position="top"
                    content="patches"
                    delay={500}
                    closeDelay={300}
                    defaultOpen={false}
                    isDisabled={false}
                  >
                    <Stack>
                      <Badge style="info" ariaLabel="patches">
                        {version.patches.length > 0
                          ? version.patches.length
                          : '-'}
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
                      <Badge style="warning" ariaLabel="minor updates">
                        {version.minors.length > 0
                          ? version.minors.length
                          : '-'}
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
                      <Badge style="default" ariaLabel="miscellaneous">
                        {version.miscs.length > 0 ? version.miscs.length : '-'}
                      </Badge>
                    </Stack>
                  </Tooltip>
                </Stack>
              </GridItem>
              <GridItem>
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
      })}
    </Stack>
  );
};
