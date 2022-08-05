import React, { ChangeEvent, FC, memo, ReactNode, useState } from 'react';
import { SearchType } from 'network/search';
import Header from '../Header/Header';
import { useSearch } from '../../../services/search';
import s from './Layout.module.css';
import MobileHeader from '../Header/components/MobileHeader/MobileHeader';
import useTopScroll from '../../../services/topScroll';
import SearchDropdown from '../Header/components/SearchDropdown/SearchDropdown';
import FloatButton from '../FloatButton/FloatButton';

export interface ISearchProps {
  searchRequestValue: (e: ChangeEvent<HTMLInputElement>) => void;
  setSearchValue: (val: string) => void;
  searchValue: string;
  topScroll?: number;
  focused: boolean;
  setFocused: (bool: boolean) => void;
}

interface ILayout {
  children?: ReactNode;
  isSearchPage?: boolean;
  initType?: SearchType;
}

const Layout: FC<ILayout> = ({ children, isSearchPage, initType }) => {
  const topScroll = useTopScroll();
  const [type, setType] = useState<SearchType>(initType || 'event');

  const {
    searchRequestValue,
    searchValue,
    dataSearch,
    setSearchValue,
    focused,
    setFocused,
    nodeInfo,
  } = useSearch(type);

  return (
    <div className={s.root}>
      <Header
        searchRequestValue={searchRequestValue}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        topScroll={topScroll}
        focused={focused}
        setFocused={setFocused}
        type={type}
        setType={setType}
      />
      <MobileHeader
        searchRequestValue={searchRequestValue}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        topScroll={topScroll}
        focused={focused}
        setFocused={setFocused}
        type={type}
        setType={setType}
      />
      <main
        className={`${s.mainContentClass} ${searchValue ? s.openSearch : ''}`}>
        {children}
      </main>
      <FloatButton />
      <div className={s.globalBgOpacity} />
      <div className={s.mainBgOpacity} />
      {!!searchValue && (
        <SearchDropdown
          dataSearch={dataSearch}
          searchValue={searchValue}
          nodeInfo={nodeInfo}
          isSearchPage={isSearchPage}
          type={type}
        />
      )}
    </div>
  );
};

export default memo(Layout);
