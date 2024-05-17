import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { CommitTag } from './CommitTag';
import { commitListItemClass, commitListItemTitleClass } from './styles.css';

interface IProps {
  commitCount: number;
}

export const CommitItem: FC<IProps> = ({ commitCount }) => {
  return (
    <Stack as="li" className={commitListItemClass}>
      <Stack flex={1} className={commitListItemTitleClass}>
        sdf
      </Stack>
      <Stack>
        {[...Array(commitCount).keys()].map((commit, idx) => (
          <CommitTag key={idx}>
            #{idx}
            {idx}
            {idx}
            {idx}
          </CommitTag>
        ))}
      </Stack>
    </Stack>
  );
};
