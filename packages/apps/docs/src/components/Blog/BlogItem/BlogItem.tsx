import { Heading } from '@kadena/react-ui';

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
        <Heading as="h4" variant="h6">
          {item.author}
        </Heading>
        <Heading as="h3" variant="h5">
          {item.title}
        </Heading>
        <div>{item.description}</div>
        <footer className={footer}>
          <span className={metaItem}>{item.readingTimeInMinutes} minutes</span>
          <FormatDate className={metaItem} date={item.publishDate} />
        </footer>
      </Link>
    </li>
  );
};
