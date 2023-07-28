import { BrowseSection } from '../BrowseSection';

import { IMostPopularPage } from '@/types/MostPopularData';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  pages: IMostPopularPage[];
  title: string;
}

const MostPopular: FC<IProps> = ({ pages = [], title }) => {
  return (
    <BrowseSection>
      <BrowseSection.LinkList title={title}>
        {pages.map((page, index) => {
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
