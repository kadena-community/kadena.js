import dynamic from 'next/dynamic';
import type { FC } from 'react';
import React from 'react';

const SearchTab = dynamic(() => import('./SearchTab'));

export interface ISearchProps {
  query?: string;
  hasScroll?: boolean;
  limitResults?: number;
}

export const Search: FC<ISearchProps> = (props) => {
  return <SearchTab {...props} />;
};
