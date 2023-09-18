import { Link } from '@kadena/react-ui';

import { StripItem } from './StripItem';
import { stripClass } from './styles.css';

import type { IMenuData } from '@/types/Layout';
import NextLink from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  data: IMenuData[];
  link: string;
  linkLabel: string;
}

export const BlogPostsStrip: FC<IProps> = ({ data, link, linkLabel }) => {
  return (
    <section>
      <ul className={stripClass}>
        {data.map((post) => (
          <StripItem key={post.root} post={post} />
        ))}
      </ul>

      <NextLink href={link} passHref legacyBehavior>
        <Link asChild>{linkLabel}</Link>
      </NextLink>
    </section>
  );
};
