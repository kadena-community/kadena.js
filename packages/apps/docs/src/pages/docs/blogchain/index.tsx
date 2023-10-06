import { Box, Grid, Stack } from '@kadena/react-ui';

import { BrowseSection, MostPopular } from '@/components';
import { BlogItem, BlogList } from '@/components/Blog';
import { BlogListWrapper } from '@/components/BlogList';
import {
  articleClass,
  contentClass,
  contentClassVariants,
  TitleHeader,
} from '@/components/Layout/components';
import { getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import type { IAuthorInfo, IMenuData, IPageProps } from '@/types/Layout';
import type { IMostPopularPage } from '@/types/MostPopularData';
import { mostProductiveAuthors } from '@/utils';
import getMostPopularPages from '@/utils/getMostPopularPages';
import { getData } from '@/utils/staticGeneration/getData.mjs';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
  popularPages: IMostPopularPage[];
  authors: IAuthorInfo[];
}

const BlogChainHome: FC<IProps> = ({
  frontmatter,
  posts,
  popularPages,
  authors,
}) => {
  const [firstPost, ...allPosts] = posts;

  return (
    <>
      <TitleHeader title={frontmatter.title} subTitle={frontmatter.subTitle} />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          {firstPost && (
            <BlogList>
              <BlogItem key={firstPost.root} item={firstPost} size="large" />
            </BlogList>
          )}

          <Grid.Root columns={{ sm: 1, lg: 4 }} gap="$2xl">
            <Grid.Item columnSpan={3}>
              <BlogListWrapper initPosts={allPosts} />
            </Grid.Item>
            <Grid.Item>
              <Box marginY="$8">
                <Stack direction="column" gap="$8">
                  {popularPages.length > 0 && (
                    <MostPopular pages={popularPages} title="Popular posts" />
                  )}

                  <Box>
                    <BrowseSection title="Productive authors">
                      {authors.map((author) => (
                        <Link key={author.id} href={`/authors/${author.id}`}>
                          {author.name}
                        </Link>
                      ))}
                    </BrowseSection>
                  </Box>
                </Stack>
              </Box>
            </Grid.Item>
          </Grid.Root>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getInitBlogPosts(getData() as IMenuData[], 0, 10);

  const mostPopularPages = await getMostPopularPages('/docs/blogchain');

  return {
    props: {
      leftMenuTree: [],
      popularPages: mostPopularPages,
      authors: mostProductiveAuthors(),
      posts,
      frontmatter: {
        title: 'BlogChain',
        menu: 'BlogChain',
        subTitle: 'The place where the blog meets the chain',
        label: 'BlogChain',
        order: 7,
        description: 'The place where the blog meets the chain',
        layout: 'home',
      },
    },
  };
};

export default BlogChainHome;
