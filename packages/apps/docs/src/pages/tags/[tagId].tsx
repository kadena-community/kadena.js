import { BlogListWrapper } from '@/components/BlogList/BlogListWrapper';
import { TitleHeader } from '@/components/Layout/components/TitleHeader/TitleHeader';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { getInitBlogPosts } from '@/hooks/useGetBlogs/utils';
import { getPageConfig } from '@/utils/config';
import { getAllBlogTags } from '@/utils/getAllBlogTags';
import type { IMenuData, IPageProps, ITag } from '@kadena/docs-tools';
import { getMenuData } from '@kadena/docs-tools';
import classNames from 'classnames';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { FC } from 'react';
import React from 'react';

interface IProps extends IPageProps {
  posts: IMenuData[];
  tagId: string;
}

const Home: FC<IProps> = ({ posts, frontmatter, tagId }) => {
  return (
    <>
      <TitleHeader title={frontmatter.title} />
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <BlogListWrapper tagId={tagId} initPosts={posts} />
        </article>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllBlogTags();
  return {
    paths: tags.map((tag: ITag) => ({
      params: { tagId: tag.tag },
    })),
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<{}, { tagId: string }> = async (
  ctx,
) => {
  const tagId = ctx.params?.tagId;

  const menuData: IMenuData[] = await getMenuData();
  const posts = getInitBlogPosts(menuData, 0, 10, {
    tagId,
  });

  return {
    props: {
      ...(await getPageConfig({})),
      posts,
      tagId,
      frontmatter: {
        title: `tag: ${tagId}`,
        menu: tagId,
        label: tagId,
        order: 0,
        layout: 'home',
      },
    },
  };
};

export default Home;
