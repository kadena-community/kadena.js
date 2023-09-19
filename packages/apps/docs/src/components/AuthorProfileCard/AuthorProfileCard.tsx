import { Box, Stack } from '@kadena/react-ui';

import { Avatar } from '../Blog/Avatar';

import { dividerClass } from './styles.css';

import type { IAuthorInfo } from '@/types/Layout';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  author: IAuthorInfo;
}

export const AuthorProfileCard: FC<IProps> = ({ author }) => {
  return (
    <section itemProp="author" itemScope itemType="https://schema.org/Person">
      <Stack>
        <Box>
          <Stack alignItems="flex-start" gap="$4">
            <Avatar name={author.name} avatar={author.avatar} />
            <Stack direction="column">
              <Link itemProp="url" href={`/authors/${author.id}`}>
                <h4 itemProp="name">{author.name}</h4>
                <span>{author.description}</span>
              </Link>
              <h4>Links</h4>
              <ul>
                <li></li>
              </ul>
            </Stack>
          </Stack>
        </Box>
        <div className={dividerClass} />
        <Box>
          <h4>Other articles</h4>
          <ul>
            {author.posts.map((post) => (
              <li key={post.root}>
                <Link href={post.root}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </Box>
      </Stack>
    </section>
  );
};
