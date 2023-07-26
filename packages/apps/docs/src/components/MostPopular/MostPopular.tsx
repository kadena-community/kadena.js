import { BrowseSection } from './BrowseSection';

import { IMostPopularPage } from '@/types/MostPopularData';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  pages: IMostPopularPage[];
  title: string;
}

const MostPopular: FC<IProps> = ({ pages = [], title }) => {
  return (
    <BrowseSection title={title}>
      {pages.map((page) => (
        <Link href={page.path} key={page.title}>
          {page.title}
        </Link>
      ))}
    </BrowseSection>
  );
};

export default MostPopular;
