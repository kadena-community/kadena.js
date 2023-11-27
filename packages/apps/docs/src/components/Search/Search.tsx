import dynamic from 'next/dynamic';
import type { FC } from 'react';
import React from 'react';
import { ITabs } from '../SearchDialog/SearchDialog';

const SearchTab = dynamic(() => import('./SearchTab'));

export interface ISearchProps {
  query?: string;
  hasScroll?: boolean;
  limitResults?: number;
  selectedTabName?: ITabs;
}

export const Search: FC<ISearchProps> = (props) => {
  return <SearchTab {...props} />;
};
