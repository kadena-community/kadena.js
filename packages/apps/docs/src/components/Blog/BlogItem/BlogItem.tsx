import { Box, Heading, Stack, Tag } from '@kadena/react-ui';

import { Avatar } from '../Avatar/Avatar';
import { FormatDate } from '../FormatDate';

import {
  authorTitleClass,
  blogitem,
  figureClass,
  figureVariant,
  footer,
  footerTags,
  footerVariant,
  gridBlogItemContent,
  gridBlogItemImage,
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
          <div className={gridBlogItemImage} style={{ gridArea: 'image' }}>
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
                    sizes="100%"
                  />
                )}
              </figure>
            </Box>
          </div>
          <div
            className={gridBlogItemContent[size]}
            style={{ gridArea: 'header' }}
          >
            <Stack alignItems="center" gap="$2">
              <Avatar
                name={item.authorInfo?.name}
                avatar={item.authorInfo?.avatar}
              />
              <Heading as="h4" variant={size === 'large' ? 'h5' : 'h6'}>
                {item.authorInfo?.name}{' '}
                {item.authorInfo?.description && (
                  <span className={authorTitleClass}>
                    {' '}
                    - {item.authorInfo.description}
                  </span>
                )}
              </Heading>
            </Stack>
            <Box marginLeft="$12" marginTop="$4">
              <Heading as="h3" variant={size === 'large' ? 'h5' : 'h6'}>
                {item.title}
              </Heading>

              <Box marginY="$4">{item.description}</Box>

              <footer className={classNames(footer, footerVariant[size])}>
                <span className={metaItem}>
                  {item.readingTimeInMinutes} minutes
                </span>
                <FormatDate date={item.publishDate} />
                <span className={footerTags}>
                  {item.tags &&
                    item.tags.map((tag) => (
                      <span className={tagLinkClass} key={tag}>
                        <Tag>{tag}</Tag>
                      </span>
                    ))}
                </span>
              </footer>
            </Box>
          </div>
        </div>
      </Link>
    </li>
  );
};
