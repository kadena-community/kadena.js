import {
  Cell,
  Column,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import { formatDistanceToNow, isAfter } from 'date-fns';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Avatar } from '../Avatar/Avatar';
import { listClass, tableClass } from './styles.css';

interface IProps {
  changelogs: IChangelogPackage[];
}

export const ChangelogTable: FC<IProps> = ({ changelogs }) => {
  console.log(changelogs);
  const reOrderedChangelog = useMemo(() => {
    return changelogs.sort((a, b) => {
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
    <Table isStriped className={tableClass}>
      <TableHeader>
        <Column>Package</Column>
        <Column>Release date</Column>
        <Column>{''}</Column>
        <Column>
          <Stack width="100%" justifyContent="flex-end">
            Contributors
          </Stack>
        </Column>
      </TableHeader>
      <TableBody>
        {reOrderedChangelog.map((pkg) => {
          const version = pkg.content[0];
          if (!version) return null;
          return (
            <Row key={pkg.slug} href={`/changelogs/${pkg.slug}`}>
              <Cell>{pkg.name}</Cell>
              <Cell>
                {formatDistanceToNow(new Date(version.date ?? 0))} ago
              </Cell>
              <Cell>
                <Stack width="100%" justifyContent="space-between">
                  <Stack>
                    patches:{' '}
                    {version.patches.length > 0 ? version.patches.length : '-'}
                  </Stack>
                  <Stack>
                    minor:{' '}
                    {version.minors.length > 0 ? version.minors.length : '-'}
                  </Stack>
                  <Stack>
                    misc:{' '}
                    {version.miscs.length > 0 ? version.miscs.length : '-'}
                  </Stack>
                </Stack>
              </Cell>
              <Cell>
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
              </Cell>
            </Row>
          );
        })}
      </TableBody>
    </Table>
  );
};
