import React, { FC, memo, useCallback, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useSWRConfig } from 'swr';
import { NetworkContext } from 'services/app';
import { NodeInfoResponseData } from 'network/info';
import { SearchResult, SearchType } from 'network/search';
import s from './SearchDropdown.module.css';
import { ISearchData } from 'utils/hooks';
import { APIRoute, Route } from 'config/Routes';
import { Loader } from '../../../Loader/Loader';
import CheckIcon from '../../../GlobalIcons/CheckIcon';
import CloseIcon from '../../../GlobalIcons/CloseIcon';

interface ISearchDropdown {
  dataSearch: ISearchData;
  searchValue: string;
  nodeInfo: NodeInfoResponseData | null | undefined;
  isSearchPage?: boolean;
  type: SearchType;
}

const SearchDropdown: FC<ISearchDropdown> = ({
  dataSearch,
  searchValue,
  nodeInfo,
  isSearchPage = false,
  type,
}) => {
  const getBaseUrl = useCallback((value: any) => {
    switch (value.type) {
      case 'event':
        if (
          value?.restProps?.chain !== undefined &&
          value?.restProps?.height !== undefined
        ) {
          return `${Route.Chain}/${value?.restProps?.chain}${Route.Height}/${value?.restProps?.height}`;
        }
        return Route.Root;
      default:
        return `${Route.Transaction}/${value.title}`;
    }
  }, []);

  const memoGetVisibleData = useCallback(getVisibleData, [type]);

  const { mutate } = useSWRConfig();
  const { network } = useContext(NetworkContext);

  const args = {
    version: nodeInfo?.version,
    instance: nodeInfo?.instance,
    query: searchValue,
    chainIds: nodeInfo?.chainIds,
  };

  useEffect(() => {
    if (searchValue) {
      if (!dataSearch.values.length) {
        mutate([APIRoute.Search, network, args, type]);
      }
    }
  }, []);

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.overflowY = 'initial';
    };
  }, []);

  const data = memoGetVisibleData(dataSearch.values);

  return (
    <div className={s.searchDropdownWrapper}>
      <div className={s.searchDropdownContainer}>
        {!isSearchPage && (
          <Link
            href={{
              pathname: Route.Search,
              query: { q: searchValue, type },
            }}>
            <a href={Route.Root} className={s.linkResultAll}>
              See All Results
            </a>
          </Link>
        )}
        {dataSearch.loading && !data.length ? null : (
          <div className={s.searchDropdownRow}>
            {data.length > 0 ? (
              data.map(value => (
                <div key={value.id} className={s.searchValues}>
                  <Link href={`${getBaseUrl(value)}`}>
                    <a target="_blank">{value.title}</a>
                  </Link>
                  {value.subTitle ? (
                    <div className={s.searchSubValues}>
                      {value.success !== undefined ? (
                        value.success ? (
                          <CheckIcon height="12" width="12" fill="#C0FB50" />
                        ) : (
                          <CloseIcon height="12" width="12" fill="#db2828" />
                        )
                      ) : null}
                      {`${value.subTitle}`}
                    </div>
                  ) : null}
                  {value.time ? (
                    <div className={s.searchSubValues}>{`${value.time}`}</div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className={s.noValues}>No Results Found</div>
            )}
          </div>
        )}
        {dataSearch.loading ? (
          <div className={s.loading}>
            <Loader size={40} text="Searching..." />
          </div>
        ) : null}
      </div>
    </div>
  );

  function getVisibleData(values: SearchResult[]) {
    return ['xYield', 'swap'].includes(type)
      ? values.filter(item => {
          if (item.subTitle) {
            if (type === 'xYield') {
              return item.subTitle.indexOf('transfer-crosschain') !== -1;
            }
            if (type === 'swap') {
              return item.subTitle.indexOf('transfer-create') !== -1;
            }
          }
          return true;
        })
      : values;
  }
};

function areEqual(prevProps: ISearchDropdown, nextProps: ISearchDropdown) {
  return (
    prevProps.searchValue === nextProps.searchValue &&
    prevProps.dataSearch.loading === nextProps.dataSearch.loading &&
    prevProps.dataSearch.values.length === nextProps.dataSearch.values.length &&
    prevProps.type === nextProps.type
  );
}

export default memo(SearchDropdown, areEqual);
