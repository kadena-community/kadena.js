import { Box, Heading, Stack, Tag } from '@kadena/react-ui';

import { Avatar } from '../Avatar/Avatar';
import { FormatDate } from '../FormatDate';

import {
  authorTitleClass,
  blogitem,
  figureClass,
  figureVariant,
  footer,
  gridWrapperClass,
  imageClass,
  link,
  metaItem,
  tagLinkClass,
} from './styles.css';

import type { IMenuData } from '@/Layout';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  item: IMenuData;
  size?: 'large' | 'default';
}

export const BlogItem: FC<IProps> = ({ item, size = 'default' }) => {
  return (
    <li className={blogitem}>
      <Link className={link} href={item.root}>
        <div className={gridWrapperClass}>
          <div style={{ gridArea: 'image' }}>
            <Box
              marginLeft={{ xs: 0, md: '$8' }}
              marginBottom={{ xs: '$8', md: 0 }}
            >
              <figure className={classNames(figureClass, figureVariant[size])}>
                {item.headerImage && (
                  <Image
                    className={imageClass}
                    src={item.headerImage}
                    fill
                    style={{ objectFit: 'cover' }}
                    alt={item.title}
                  />
                )}
              </figure>
            </Box>
          </div>
          <div style={{ gridArea: 'header' }}>
            <Stack alignItems="center" gap="$2">
              <Avatar
                name={item.authorInfo?.name}
                avatar={item.authorInfo?.avatar}
              />
              <Heading as="h4" variant="h6">
                {item.authorInfo?.name}{' '}
                {item.authorInfo?.description && (
                  <span className={authorTitleClass}>
                    {' '}
                    - {item.authorInfo.description}
                  </span>
                )}
              </Heading>
            </Stack>
            <Heading as="h3" variant="h5">
              {item.title}
            </Heading>

            <div>{item.description}</div>

            <footer className={footer}>
              <span className={metaItem}>
                {item.readingTimeInMinutes} minutes
              </span>
              <FormatDate className={metaItem} date={item.publishDate} />
              <span>
                {item.tags &&
                  item.tags.map((tag) => (
                    <span className={tagLinkClass} key={tag}>
                      <Tag>{tag}</Tag>
                    </span>
                  ))}
              </span>
            </footer>
          </div>
        </div>
      </Link>
    </li>
  );
};
