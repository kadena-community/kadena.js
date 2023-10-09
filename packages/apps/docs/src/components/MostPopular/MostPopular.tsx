import { BrowseSection } from '../BrowseSection/BrowseSection';

import type { IMostPopularPage } from '@/MostPopularData';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  pages: IMostPopularPage[];
  title: string;
}

const MostPopular: FC<IProps> = ({ pages = [], title }) => {
  return (
    <BrowseSection title={title}>
      {pages.map((page, index) => (
        <Link href={page.path} key={index}>
          {page.title}
        </Link>
      ))}
    </BrowseSection>
  );
};

export default MostPopular;
