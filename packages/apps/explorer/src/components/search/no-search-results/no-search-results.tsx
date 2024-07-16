import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import type { ISearchItem } from '../search-component/search-component';

interface IProps {
  searchData: ISearchItem[];
}

const NoSearchResults: FC<IProps> = ({ searchData }) => {
  if (
    !searchData[SearchOptionEnum.ACCOUNT].data.length &&
    !searchData[SearchOptionEnum.BLOCKHASH].data?.block &&
    !searchData[SearchOptionEnum.BLOCKHEIGHT].data?.blocksFromHeight?.edges
      .length &&
    !searchData[SearchOptionEnum.EVENT].data?.events?.edges.length &&
    !searchData[SearchOptionEnum.REQUESTKEY].data?.transaction
  )
    return (
      <Stack justifyContent="center">
        <h3>No search results</h3>
      </Stack>
    );
};

export default NoSearchResults;
