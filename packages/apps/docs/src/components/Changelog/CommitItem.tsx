import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { CommitTag } from './CommitTag';
import {
  commitListItemClass,
  commitListItemTitleClass,
  tagContainerClass,
} from './styles.css';

interface IProps {
  commit: IChangelogVersionRecord;
}

export const CommitItem: FC<IProps> = ({ commit }) => {
  const ids = useMemo(() => {
    return [
      ...commit.commits.map((commit) => commit.hash),
      ...commit.prIds.map((pr) => `#${pr.id}`),
    ];
  }, [commit]);

  return (
    <Stack as="li" className={commitListItemClass}>
      <Stack flex={1} className={commitListItemTitleClass}>
        {commit.label}
      </Stack>
      {ids.length > 0 && (
        <Stack flexWrap="wrap" className={tagContainerClass}>
          {ids.map((id, idx) => (
            <CommitTag key={id}>{id}</CommitTag>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
