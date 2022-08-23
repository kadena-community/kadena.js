import React, { FC, memo, useState } from 'react';
import { SearchType } from 'network/search';
import { ISearchProps } from '../../../Layout/Layout';
import MobileSearch from '../MobileSearch/MobileSearch';
import SearchIcon from '../../../GlobalIcons/SearchIcon';
import CloseIcon from '../../../GlobalIcons/CloseIcon';
import style from './MobileHeader.module.css';
import MobileDropdownMenu from './MobileDropdownMenu/MobileDropdownMenu';
import KadenaLogo from '../KadenaLogo/KadenaLogo';

const MobileHeader: FC<
  ISearchProps & { type: SearchType; setType: (type: SearchType) => void }
> = ({
  searchRequestValue,
  searchValue,
  setSearchValue,
  topScroll,
  focused,
  setFocused,
  type,
  setType,
}) => {
  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  return (
    <header
      className={`${style.mobileContainer} headerTop`}
      style={{
        background: `rgba(23, 13, 40, ${topScroll && topScroll / 90})`,
      }}>
      {activeSearch ? (
        <>
          <MobileSearch
            searchRequestValue={searchRequestValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            focused={focused}
            setFocused={setFocused}
            type={type}
            setType={setType}
          />
          <div
            className={style.closeIcon}
            onClick={() => {
              setActiveSearch(!activeSearch);
              setSearchValue('');
            }}>
            <CloseIcon height="16" width="16" fill="#975E9A" />
          </div>
        </>
      ) : (
        <>
          <MobileDropdownMenu />
          <KadenaLogo id="mobile" width={32} height={35.5} />
          <div
            className={style.iconStyle}
            onClick={() => setActiveSearch(!activeSearch)}>
            <SearchIcon height="20" width="20" fill="#FFF" />
          </div>
        </>
      )}
    </header>
  );
};

export default memo(MobileHeader);
