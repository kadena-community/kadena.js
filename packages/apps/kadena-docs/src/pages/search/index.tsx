import { TextField } from '@kadena/react-components';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import React, { ChangeEvent, FC, useState } from 'react';

const Search: FC = () => {
  const [query, setQuery] = useState<string | undefined>();

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { currentTarget } = event;
    const value = currentTarget.value;
    setQuery(value);
  };
  return (
    <section>
      <TextField inputProps={{ onChange }} />
      <div>{query}</div>
    </section>
  );
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Search',
        menu: 'Search',
        label: 'Search',
        order: 0,
        description: 'We will find stuff for u',
        layout: 'landing',
        icon: 'KadenaOverview',
      },
    },
  };
};

export default Search;
