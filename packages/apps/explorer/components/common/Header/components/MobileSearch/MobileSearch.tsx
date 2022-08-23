import React, { FC, memo } from 'react';
import { SearchType } from 'network/search';
import { ISearchProps } from '../../../Layout/Layout';
import s from '../Search/Search.module.css';
import SelectSearch from '../SelectSearch/SelectSearch';

const MobileSearch: FC<
  ISearchProps & { type: SearchType; setType: (type: SearchType) => void }
> = ({
  searchValue,
  searchRequestValue,
  focused,
  setFocused,
  type,
  setType,
}) => {
  return (
    <div
      className={`${s.searchInput} ${focused && s.activeSearchInput} ${
        s.mobileSearchInput
      }`}>
      <SelectSearch type={type} setType={setType} />
      <input
        className={s.searchInputClass}
        autoFocus
        spellCheck={false}
        value={searchValue}
        onChange={searchRequestValue}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          color: focused ? '#000' : '#fff',
        }}
      />
    </div>
  );
};

export default memo(MobileSearch);
