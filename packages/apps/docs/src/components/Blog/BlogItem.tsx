import { IMenuData } from '@/types/Layout';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  item: IMenuData;
}

export const BlogItem: FC<IProps> = ({ item }) => {
  return (
    <li>
      <Link href={item.root}>
        <h4>{item.author}</h4>
        <h3>{item.title}</h3>
        <div>{item.description}</div>
        <footer>
          <time dateTime={item.publishDate}>{item.publishDate}</time>
        </footer>
      </Link>
    </li>
  );
};
