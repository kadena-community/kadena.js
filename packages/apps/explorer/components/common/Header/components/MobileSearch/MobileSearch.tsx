import React, { FC, memo } from 'react';
import { SearchType } from 'network/search';
import { ISearchProps } from 'components/common/Layout/Layout';
import s from '../Search/Search.module.css';
import SelectSearch from '../SelectSearch/SelectSearch';

const MobileSearch: FC<
  ISearchProps & { type: SearchType; setType: (type: SearchType) => void }
> = ({
  searchValue,
  searchRequestValue,
  isFocused,
  setIsFocused,
  type,
  setType,
}) => {
  return (
    <div
      className={`${s.searchInput} ${isFocused && s.activeSearchInput} ${
        s.mobileSearchInput
      }`}>
      <SelectSearch type={type} setType={setType} />
      <input
        className={s.searchInputClass}
        autoFocus
        spellCheck={false}
        value={searchValue}
        onChange={searchRequestValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          color: isFocused ? '#000' : '#fff',
        }}
      />
    </div>
  );
};

export default memo(MobileSearch);
