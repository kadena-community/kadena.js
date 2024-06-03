import { Stack, Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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
      ...commit.commits.map((commit) => ({
        id: commit.hash,
        url: commit.data?.data.html_url,
      })),
      ...commit.prIds.map((pr) => ({
        id: `#${pr.id}`,
        url: pr.data?.data.html_url,
      })),
    ];
  }, [commit]);

  return (
    <Stack as="li" className={commitListItemClass}>
      <Stack flex={1} className={commitListItemTitleClass}>
        <Text as="span" variant="body">
          <ReactMarkdown rehypePlugins={[rehypeRaw] as any}>
            {commit.label}
          </ReactMarkdown>
        </Text>
      </Stack>
      {ids.length > 0 && (
        <Stack flexWrap="wrap" className={tagContainerClass}>
          {ids.map(({ id, url }, idx) => (
            <CommitTag key={id} url={url}>
              {id}
            </CommitTag>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
