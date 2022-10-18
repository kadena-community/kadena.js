import React, { FC, memo } from 'react';
import { SearchType } from 'network/search';
import { ISearchProps } from '../../../Layout/Layout';
import CloseIcon from '../../../GlobalIcons/CloseIcon';
import SearchIcon from '../../../GlobalIcons/SearchIcon';
import SelectSearch from '../SelectSearch/SelectSearch';

import s from './Search.module.css';

const Search: FC<
  ISearchProps & { type: SearchType; setType: (type: SearchType) => void }
> = ({
  searchRequestValue,
  searchValue,
  setSearchValue,
  isFocused,
  setIsFocused,
  type,
  setType,
}) => {
  return (
    <div className={`${s.searchInput} ${isFocused && s.activeSearchInput}`}>
      <SelectSearch type={type} setType={setType} />
      <input
        className={s.searchInputClass}
        value={searchValue}
        spellCheck={false}
        onChange={searchRequestValue}
        style={{ color: isFocused ? '#000' : '#fff' }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchValue ? (
        <div
          className={s.close}
          onClick={() => {
            setSearchValue('');
          }}>
          <CloseIcon height="14" width="14" fill="#975E9A" />
        </div>
      ) : (
        <div className={s.loupe}>
          <SearchIcon height="18" width="18" fill="#975E9A" />
        </div>
      )}
    </div>
  );
};

export default memo(Search);
