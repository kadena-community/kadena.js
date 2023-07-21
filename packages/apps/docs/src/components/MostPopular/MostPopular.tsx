import { BrowseSection } from '../BrowseSection';

import { useFetchMostPopularPages } from './useFetchMostPopularPages';

import Link from 'next/link';
import React, { FC } from 'react';

const MostPopular: FC = () => {
  const { data } = useFetchMostPopularPages();

  return (
    <BrowseSection>
      <BrowseSection.LinkList title="Most Popular">
        {data.map((page, index) => {
          return (
            <Link href={page.path} key={`most-popular-${index}`}>
              {page.title}
            </Link>
          );
        })}
      </BrowseSection.LinkList>
    </BrowseSection>
  );
};

export default MostPopular;
