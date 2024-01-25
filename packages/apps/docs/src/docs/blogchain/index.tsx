import type { IMostPopularPage } from '@/MostPopularData';
import { BlogItem } from '@/components/Blog/BlogItem/BlogItem';
import { BlogList } from '@/components/Blog/BlogList';
import { BlogListWrapper } from '@/components/BlogList/BlogListWrapper';
import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { TitleHeader } from '@/components/Layout/components/TitleHeader/TitleHeader';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import MostPopular from '@/components/MostPopular/MostPopular';
import { getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import { getPageConfig } from '@/utils/config';
import { mostProductiveAuthors } from '@/utils/mostProductiveAuthors';
import type { IAuthorInfo, IMenuData, IPageProps } from '@kadena/docs-tools';
import { getMenuData } from '@kadena/docs-tools';
import { Box, Grid, GridItem, Stack } from '@kadena/react-ui';
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

          <Grid columns={{ sm: 1, lg: 4 }} gap="xxl">
            <GridItem columnSpan={3}>
              <BlogListWrapper initPosts={allPosts} />
            </GridItem>
            <GridItem>
              <Box marginBlock="xxl">
                <Stack flexDirection="column" gap="xxl">
                  {popularPages.length > 0 && (
                    <MostPopular pages={popularPages} title="Popular posts" />
                  )}

                  <Box>
                    <BrowseSection title="Productive authors" titleAs="h6">
                      {authors.map((author) => (
                        <Link key={author.id} href={`/authors/${author.id}`}>
                          {author.name}
                        </Link>
                      ))}
                    </BrowseSection>
                  </Box>
                </Stack>
              </Box>
            </GridItem>
          </Grid>
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const menuData: IMenuData[] = await getMenuData();
  const posts = getInitBlogPosts(menuData, 0, 10);

  return {
    props: {
      ...(await getPageConfig({
        blogPosts: true,
        popularPages: '/blogchain',
        filename: __filename,
      })),
      authors: await mostProductiveAuthors(),
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
