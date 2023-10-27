import type { IAuthorInfo } from '@/Layout';
import { Box, Stack } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { Avatar } from '../Blog/Avatar/Avatar';
import { BrowseSection } from '../BrowseSection/BrowseSection';
import {
  descriptionClass,
  linkClass,
  sectionClass,
  sectionExtraClass,
} from './styles.css';

interface IProps {
  author: IAuthorInfo;
}

export const AuthorProfileCard: FC<IProps> = ({ author }) => {
  return (
    <section itemProp="author" itemScope itemType="https://schema.org/Person">
      <Stack direction={{ sm: 'column', md: 'row' }} gap="$10">
        <div className={sectionClass}>
          <Stack alignItems="flex-start" gap="$4">
            <Avatar size="large" name={author.name} avatar={author.avatar} />
            <Stack direction="column">
              <Link
                className={linkClass}
                itemProp="url"
                href={`/authors/${author.id}`}
              >
                <h4 itemProp="name">{author.name}</h4>
                <span className={descriptionClass}>{author.description}</span>
              </Link>

              <Box marginTop="$4">
                <BrowseSection title="Links">
                  {author.twitter && (
                    <Link href={`https://x.com/${author.twitter}`}>
                      Twitter
                    </Link>
                  )}
                  {author.linkedin && (
                    <Link
                      href={`https://www.linkedin.com/in/${author.linkedin}`}
                    >
                      LinkedIn
                    </Link>
                  )}
                </BrowseSection>
              </Box>
            </Stack>
          </Stack>
        </div>

        <div className={sectionExtraClass}>
          <BrowseSection title="Latest posts">
            {author.posts?.map((post) => (
              <Link key={post.root} href={post.root}>
                {post.title}
              </Link>
            ))}
          </BrowseSection>
        </div>
      </Stack>
    </section>
  );
};
