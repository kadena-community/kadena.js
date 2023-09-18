import { Link, Text } from '@kadena/react-ui';

import {
  figureClass,
  stripClass,
  stripItemClass,
  stripItemWrapperClass,
} from './styles.css';

import type { IMenuData } from '@/types/Layout';
import Image from 'next/image';
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
          <li className={stripItemWrapperClass} key={post.root}>
            <div className={stripItemClass}>
              <figure className={figureClass}>
                {post.headerImage ? (
                  <Image
                    src={post.headerImage}
                    fill
                    style={{ objectFit: 'cover' }}
                    alt={post.title}
                  />
                ) : (
                  <div />
                )}
              </figure>
              <h4>{post.title}</h4>
              <Text>{post.description}</Text>
            </div>
          </li>
        ))}
      </ul>

      <NextLink href={link} passHref legacyBehavior>
        <Link asChild>{linkLabel}</Link>
      </NextLink>
    </section>
  );
};
