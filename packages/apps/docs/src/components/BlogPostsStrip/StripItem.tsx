import { Box } from '@kadena/react-ui';

import {
  figureClass,
  headerClass,
  imageClass,
  stripItemClass,
  stripItemWrapperClass,
  textClass,
} from './styles.css';

import type { IMenuData } from '@/Layout';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  post: IMenuData;
}

export const StripItem: FC<IProps> = ({ post }) => {
  return (
    <li className={stripItemWrapperClass}>
      <Link href={post.root} passHref legacyBehavior>
        <a className={stripItemClass}>
          <figure className={figureClass}>
            {post.headerImage ? (
              <Image
                className={imageClass}
                src={post.headerImage}
                fill
                style={{ objectFit: 'cover' }}
                alt={post.title}
              />
            ) : (
              <div />
            )}
          </figure>
          <Box marginY="$2">
            <h4 className={headerClass}>{post.title}</h4>
          </Box>
          <div className={textClass}>{post.description}</div>
        </a>
      </Link>
    </li>
  );
};
