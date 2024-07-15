import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import { truncateValues } from '@/services/format';
import type { ApolloError } from '@apollo/client';
import { MonoSearch } from '@kadena/kode-icons/system';
import { Badge, Box, Stack } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  editOptionClass,
  editOptionSelectedClass,
  editingBoxClass,
  searchBadgeBoxClass,
  searchBarClass,
  searchBoxClass,
  searchBoxEditingClass,
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
  position?: 'header' | 'default';
}

const SearchComponent: React.FC<ISearchComponentProps> = ({
  position = 'default',
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
        <Stack
          alignItems="flex-start"
          className={classNames(searchBoxClass, {
            [searchBoxEditingClass]: isEditing,
          })}
          style={{ top: position === 'header' ? '-28px' : 0 }}
        >
          <Stack width="100%" alignItems="center" paddingInline="md">
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
            {isEditing && (
              <Stack className={searchBadgeBoxClass}>Search by</Stack>
            )}

            {searchOption !== null && (
              <Stack className={searchBadgeBoxClass}>
                {!!searchData[searchOption] && searchData[searchOption].title}
              </Stack>
            )}
          </Stack>

          {isEditing && (
            <Stack flexDirection="column" className={editingBoxClass}>
              {searchData?.map((item, index) => (
                <Stack
                  className={classNames(editOptionClass, {
                    [editOptionSelectedClass]: searchOption === index,
                  })}
                  key={index}
                  onMouseDown={() => setOptionClicked(true)}
                  onClick={() => {
                    handleSearch();
                    setSearchOption(index);
                    setIsEditing(false);
                  }}
                >
                  <Stack>{item.title}</Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default SearchComponent;
