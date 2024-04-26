import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { SearchHeader } from '@/components/Layout/Landing/components';
import { Search } from '@/components/Search/Search';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { getPageConfig } from '@/utils/config';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import type { FC, FormEvent } from 'react';
import React, { useEffect, useState } from 'react';

interface IQuery {
  q?: string;
}

const SearchPage: FC = () => {
  const router = useRouter();
  const { q } = router.query as IQuery;
  const [query, setQuery] = useState<string | undefined>(q);

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();

    const data = new FormData(evt.currentTarget);
    const value = `${data.get('search')}`;

    setQuery(value);
  };

  useEffect(() => {
    if (q !== undefined && q !== '') {
      setQuery(q);
    }
  }, [q, setQuery]);

  return (
    <>
      <SearchHeader>
        <SearchBar onSubmit={handleSubmit} query={query} />
      </SearchHeader>
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <Search query={query} />
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      ...(await getPageConfig({ filename: __filename })),
      frontmatter: {
        title: 'Search',
        menu: 'Search',
        label: 'Search',
        order: 0,
        description: 'We will find stuff for u',
        layout: 'home',
      },
    },
  };
};

export default SearchPage;
