import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { CommitTag } from './CommitTag';
import { commitListItemClass } from './styles.css';

interface IProps {
  commitCount: number;
}

export const CommitItem: FC<IProps> = ({ commitCount }) => {
  return (
    <li className={commitListItemClass}>
      <Stack flex={1}>sdf</Stack>
      <Stack>
        {[...Array(commitCount).keys()].map((commit, idx) => (
          <CommitTag key={idx}>{idx}</CommitTag>
        ))}
      </Stack>
    </li>
  );
};
