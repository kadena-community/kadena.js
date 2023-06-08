import { SystemIcons, TextField } from '@kadena/react-components';

import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import debounce from 'lodash.debounce';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface IQuery {
  q?: string;
}

const Search: FC = () => {
  const router = useRouter();
  const { q } = router.query as IQuery;
  const [query, setQuery] = useState<string | undefined>();
  const [isInitiated, setIsInitiated] = useState<boolean>(false);

  useEffect(() => {
    if (Boolean(q) && query === undefined && !isInitiated) {
      setIsInitiated(true);
      setQuery(q);
    }
  }, [q, setQuery, query, setIsInitiated, isInitiated]);

  const updateQuery = useMemo(() => {
    const update = async (value: string): Promise<void> => {
      setQuery(value);
      await router.push(`${router.route}?q=${value}`);
    };

    return debounce(update, 500);
  }, [router]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { currentTarget } = event;
      const value = currentTarget.value;

      updateQuery(value);
    },
    [updateQuery],
  );
  return (
    <section>
      <TextField
        inputProps={{
          defaultValue: query,
          onChange,
          placeholder: 'Search',
          leftPanel: () => <SystemIcons.Magnify />,
          'aria-label': 'Search',
        }}
      />
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
