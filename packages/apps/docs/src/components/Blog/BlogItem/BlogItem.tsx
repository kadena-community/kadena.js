import { Heading, Stack } from '@kadena/react-ui';

import { Avatar } from '../Avatar';
import { FormatDate } from '../FormatDate';

import { blogitem, footer, link, metaItem } from './styles.css';

import { IMenuData } from '@/types/Layout';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  item: IMenuData;
}

export const BlogItem: FC<IProps> = ({ item }) => {
  return (
    <li className={blogitem}>
      <Link className={link} href={item.root}>
        <Stack direction="column" spacing="$3">
          <Stack alignItems="center" spacing="$2">
            <Avatar name={item.author} />
            <Heading as="h4" variant="h6">
              {item.author}
            </Heading>
          </Stack>
          <Heading as="h3" variant="h5">
            {item.title}
          </Heading>
          <div>{item.description}</div>
        </Stack>
        <footer className={footer}>
          <span className={metaItem}>{item.readingTimeInMinutes} minutes</span>
          <FormatDate className={metaItem} date={item.publishDate} />
        </footer>
      </Link>
    </li>
  );
};
