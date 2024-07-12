import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import { truncateValues } from '@/services/format';
import type { ApolloError } from '@apollo/client';
import { MonoSearch } from '@kadena/kode-icons/system';
import { Badge, Box, Stack } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  editingBoxClass,
  searchBadgeBoxClass,
  searchBoxClass,
  searchInputClass,
} from './search-component.css';

export type SearchItemTitle =
  | 'Account'
  | 'Request Key'
  | 'Height'
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

const SearchComponent: React.FC<ISearchComponentProps> = ({
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
  const ref = useRef<HTMLInputElement>(null);

  const handleSearchOption = (
    inferedOption: SearchItemTitle | undefined,
  ): void => {
    if (inferedOption === 'Account') {
      setSearchOption(SearchOptionEnum.ACCOUNT);
    }
    if (inferedOption === 'Request Key') {
      setSearchOption(SearchOptionEnum.REQUESTKEY);
    }

    if (inferedOption === 'Height') {
      setSearchOption(SearchOptionEnum.BLOCKHEIGHT);
    }

    if (!inferedOption || inferedOption === undefined) {
      setSearchOption(null);
    }
  };

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
      return 'Height';
    }

    return undefined;
  };

  const handleSearch = (): void => {
    const value = ref.current?.value ?? '';
    if (setSearchQuery) setSearchQuery(value);
  };

  const handleSearchValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchValue(e.target.value);

    if (escapePressed || optionClicked) return;

    const inferedOption = inferOption(e.target.value);
    handleSearchOption(inferedOption);
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
      handleSearch();
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
      <Stack
        position="relative"
        width="100%"
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
            ref={ref}
            type="text"
            placeholder="Search the Kadena Blockchain on"
            value={searchValue}
            onChange={(e) => handleSearchValueChange(e)}
            onClick={() => setIsEditing((v) => !v)}
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
          <div className={editingBoxClass}>
            {searchData?.map((item, index) => (
              <Box
                key={index}
                onMouseDown={() => setOptionClicked(true)}
                onClick={() => {
                  handleSearch();
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
      </Stack>
    </>
  );
};

export default SearchComponent;
