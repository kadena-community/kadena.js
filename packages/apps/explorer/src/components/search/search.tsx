import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import { truncateValues } from '@/services/format';
import type { ApolloError } from '@apollo/client';
import { MonoSearch } from '@kadena/react-icons/system';
import { Badge, Box } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react';
import {
  searchBadgeBoxClass,
  searchBoxClass,
  searchInputClass,
} from './search.css';

export type SearchItemTitle =
  | 'Account'
  | 'Request Key'
  | 'Block Height'
  | 'Block Hash'
  | 'Events';

export interface ISearchItem {
  title: SearchItemTitle;
  data?: any;
}
export interface ISearchComponentProps {
  searchData: ISearchItem[];
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  searchQuery?: string;
  searchOption: SearchOptionEnum | null;
  setSearchOption: Dispatch<SetStateAction<SearchOptionEnum | null>>;
  loading: boolean;
  errors: ApolloError[];
}

const SearchCombobox: React.FC<ISearchComponentProps> = ({
  searchData,
  setSearchQuery,
  searchQuery,
  searchOption,
  setSearchOption,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [optionClicked, setOptionClicked] = useState(false);
  const [escapePressed, setEscapePressed] = useState(false);

  const inferOption = (value: string): SearchItemTitle | undefined => {
    if (
      value.toLocaleLowerCase().startsWith('k:') ||
      value.toLocaleLowerCase().startsWith('w:')
    ) {
      return 'Account';
    } else if (value.includes('.')) {
      return 'Events';
    } else if (value.length === 43) {
      return 'Request Key';
    } else if (/^\d+$/.test(value)) {
      return 'Block Height';
    }

    return undefined;
  };

  const handleSearch = (value: string): void => {
    if (setSearchQuery) setSearchQuery(value);
  };

  const handleSearchValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchValue(e.target.value);

    if (escapePressed || optionClicked) return;

    const inferedOption = inferOption(e.target.value);
    if (inferedOption === 'Account') {
      setSearchOption(SearchOptionEnum.ACCOUNT);
    }
    if (inferedOption === 'Request Key') {
      setSearchOption(SearchOptionEnum.REQUESTKEY);
    }

    if (inferedOption === 'Block Height') {
      setSearchOption(SearchOptionEnum.BLOCKHEIGHT);
    }

    if (!inferedOption || inferedOption === undefined) {
      setSearchOption(null);
    }
  };

  const handleSearchValueKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
  ): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchOption((prev) =>
        prev === null ? 0 : Math.min(prev + 1, searchData.length - 1),
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchOption((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      setEscapePressed(false);
      setOptionClicked(false);
      handleSearch(searchValue);
    } else if (e.key === 'Escape') {
      setOptionClicked(false);
      setSearchOption(null);
      setEscapePressed(true);
      setIsEditing(false);
    } else {
      setEscapePressed(false);
      setOptionClicked(false);
    }
  };

  useEffect(() => {
    setSearchValue(searchQuery ?? '');
  }, [searchQuery]);

  return (
    <>
      <Box
        paddingInline={'xxl'}
        display={'flex'}
        flexDirection={'column'}
        onKeyDown={(e) => handleSearchValueKeyDown(e)}
        onBlur={() => {
          if (!optionClicked) {
            setIsEditing(false);
          }
        }}
      >
        <Box
          display={'inline-flex'}
          flexDirection={'row'}
          alignItems={'center'}
          borderStyle="solid"
          borderWidth="hairline"
          backgroundColor="base.default"
          gap={'sm'}
          paddingInlineStart={'sm'}
          paddingInlineEnd={'sm'}
          className={searchBoxClass}
        >
          <MonoSearch />

          <input
            type="text"
            placeholder="Search the Kadena Blockchain on"
            value={searchValue}
            onChange={(e) => handleSearchValueChange(e)}
            onFocus={() => setIsEditing(true)}
            className={searchInputClass}
          />

          {searchOption !== null && (
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              className={searchBadgeBoxClass}
            >
              {searchData[searchOption] && (
                <Badge size="lg">{searchData[searchOption].title}</Badge>
              )}
            </Box>
          )}
        </Box>

        {isEditing && (
          <div
            className={atoms({
              display: 'grid',
              borderStyle: 'solid',
              borderWidth: 'hairline',
              backgroundColor: 'base.@active',
              fontSize: 'sm',
              fontFamily: 'primaryFont',
            })}
          >
            {searchData?.map((item, index) => (
              <Box
                key={index}
                onMouseDown={() => setOptionClicked(true)}
                onClick={() => {
                  setSearchOption(index);
                  setIsEditing(false);
                }}
                style={{
                  gridTemplateColumns: '1fr 3fr',
                  borderLeft: index === searchOption ? 'solid' : 'none',
                }}
                className={atoms({
                  display: 'grid',
                  alignItems: 'flex-start',
                  paddingInlineStart: 'md',
                  cursor: 'pointer',
                  backgroundColor:
                    index === searchOption ? 'base.@active' : 'base.default',
                  width: '100%',
                })}
              >
                <div
                  className={atoms({
                    alignItems: 'flex-start',
                  })}
                >
                  {item.title}
                </div>
                <div
                  className={atoms({
                    alignItems: 'flex-end',
                  })}
                >
                  {truncateValues(searchValue)}
                </div>
              </Box>
            ))}
          </div>
        )}
      </Box>
    </>
  );
};

export default SearchCombobox;
