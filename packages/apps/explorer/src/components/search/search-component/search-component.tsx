import LoadingIcon from '@/components/loading-icon/loading-icon';
import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import type { ApolloError } from '@apollo/client';
import { MonoSearch } from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  editOptionClass,
  editOptionHoverClass,
  editOptionSelectedClass,
  editingBoxClass,
  searchBadgeBoxClass,
  searchBadgeBoxSelectedClass,
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
  loading,
}) => {
  const [selectedSearchOption, setSelectedSearchOption] =
    useState<SearchOptionEnum | null>(null);
  const [editHover, setEditHover] = useState<null | number>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [optionClicked, setOptionClicked] = useState(false);
  const [escapePressed, setEscapePressed] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleSearchOption = (
    inferedOption: SearchItemTitle | undefined,
  ): void => {
    // if the option is selected by hand, do not infer the value
    if (selectedSearchOption) return;

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
    if (e.key === 'Tab') {
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setEditHover((prev) =>
        prev === null ? 0 : Math.min(prev + 1, searchData.length - 1),
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setEditHover((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing((v) => !v);
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
          // ugly hack to align the search in the header
          style={{ top: position === 'header' ? '-28px' : 0 }}
        >
          <Stack width="100%" alignItems="center" paddingInline="md">
            {loading ? <LoadingIcon /> : <MonoSearch />}

            <input
              ref={ref}
              type="text"
              placeholder="Search the Kadena Blockchain on"
              value={searchValue}
              onChange={(e) => handleSearchValueChange(e)}
              onClick={() => setIsEditing((v) => !v)}
              className={searchInputClass}
            />
            {isEditing && searchOption === null && (
              <Stack className={searchBadgeBoxClass}>Search by</Stack>
            )}

            {searchOption !== null && (
              <Stack
                gap="xs"
                as="button"
                className={classNames(
                  searchBadgeBoxClass,
                  searchBadgeBoxSelectedClass,
                )}
                onClick={() => {
                  setSelectedSearchOption(null);
                  setSearchOption(null);
                }}
              >
                {!!searchData[searchOption] && searchData[searchOption].title}

                {!!selectedSearchOption && <Stack as="span">x</Stack>}
              </Stack>
            )}
          </Stack>

          {isEditing && (
            <Stack flexDirection="column" className={editingBoxClass}>
              {searchData?.map((item, index) => (
                <Stack
                  className={classNames(editOptionClass, {
                    [editOptionSelectedClass]: searchOption === index,
                    [editOptionHoverClass]: editHover === index,
                  })}
                  key={index}
                  onMouseDown={() => setOptionClicked(true)}
                  onMouseEnter={() => setEditHover(index)}
                  onMouseLeave={() => setEditHover(null)}
                  onClick={() => {
                    handleSearch();
                    setSelectedSearchOption(index);
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
