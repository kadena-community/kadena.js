import { IMenuData } from '@/types/Layout';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  item: IMenuData;
}

export const BlogItem: FC<IProps> = ({ item }) => {
  return (
    <li>
      <Link href={item.root}>{item.title}</Link>
    </li>
  );
};
