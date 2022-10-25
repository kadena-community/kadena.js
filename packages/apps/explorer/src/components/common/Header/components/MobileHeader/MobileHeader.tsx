import CloseIcon from '../../../GlobalIcons/CloseIcon';
import SearchIcon from '../../../GlobalIcons/SearchIcon';
import { ISearchProps } from '../../../Layout/Layout';
import KadenaLogo from '../KadenaLogo/KadenaLogo';
import MobileSearch from '../MobileSearch/MobileSearch';

import MobileDropdownMenu from './MobileDropdownMenu/MobileDropdownMenu';
import s from './MobileHeader.module.css';

import { SearchType } from 'network/search';
import React, { FC, memo, useState } from 'react';

const MobileHeader: FC<
  ISearchProps & { type: SearchType; setType: (type: SearchType) => void }
> = ({
  searchRequestValue,
  searchValue,
  setSearchValue,
  topScroll,
  isFocused,
  setIsFocused,
  type,
  setType,
}) => {
  const [activeSearch, setActiveSearch] = useState<boolean>(false);

  return (
    <header
      className={`${s.mobileContainer} headerTop`}
      style={{
        background: `rgba(23, 13, 40, ${topScroll && topScroll / 90})`,
      }}
    >
      {activeSearch ? (
        <>
          <MobileSearch
            searchRequestValue={searchRequestValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            type={type}
            setType={setType}
          />
          <div
            className={s.closeIcon}
            onClick={() => {
              setActiveSearch(!activeSearch);
              setSearchValue('');
            }}
          >
            <CloseIcon height="16" width="16" fill="#975E9A" />
          </div>
        </>
      ) : (
        <>
          <MobileDropdownMenu />
          <KadenaLogo id="mobile" width={32} height={35.5} />
          <div
            className={s.iconStyle}
            onClick={() => setActiveSearch(!activeSearch)}
          >
            <SearchIcon height="20" width="20" fill="#FFF" />
          </div>
        </>
      )}
    </header>
  );
};

export default memo(MobileHeader);
