import Layout from 'components/common/Layout/Layout';
import { SearchType } from 'network/search';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

const SearchPage: FC = () => {
  const router = useRouter();

  const type = router.query?.type ? String(router.query?.type) : 'event';

  return <Layout isSearchPage initType={type as SearchType} />;
};

export default SearchPage;
