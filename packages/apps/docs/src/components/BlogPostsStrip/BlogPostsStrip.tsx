import { Link } from '@kadena/react-ui';

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
      <ul>
        {data.map((post) => (
          <li key={post.root}>
            {post.title}
            <ul>
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <NextLink href={link} passHref legacyBehavior>
        <Link asChild>{linkLabel}</Link>
      </NextLink>
    </section>
  );
};
