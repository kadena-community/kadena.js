import LoadingIcon from '@/components/loading-icon/loading-icon';
import type { SearchOptionEnum } from '@/hooks/search/utils/utils';
import type { ApolloError } from '@apollo/client';
import { MonoSearch } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  editOptionClass,
  editOptionHoverClass,
  editingBoxClass,
  iconColorClass,
  searchBadgeBoxClass,
  searchBadgeBoxSelectedClass,
  searchBoxClass,
  searchBoxEditingClass,
  searchInputClass,
} from './search-component.css';

export type SearchItemTitle =
  | 'Accounts'
  | 'Request Keys'
  | 'Heights'
  | 'Block Hashes'
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
  const [editHover, setEditHover] = useState<null | number>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [innerSearchOption, setInnerSearchOption] =
    useState<SearchOptionEnum | null>(searchOption);
  const [optionClicked, setOptionClicked] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  const handleSearch = (searchOptionIdx: SearchOptionEnum | null): void => {
    if (searchOptionIdx !== null) {
      setSearchOption(searchOptionIdx);
      setInnerSearchOption(searchOptionIdx);
    } else {
      setInnerSearchOption(null);
      setSearchOption(null);
    }

    setIsEditing(false);

    const value = ref.current?.value ?? '';
    if (setSearchQuery) setSearchQuery(value);
  };

  const handleSearchValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInnerSearchOption(null);
    setEditHover(null);
    setIsEditing(true);
  };

  const handleSearchValueKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
  ): void => {
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
      setOptionClicked(false);

      handleSearch(editHover);
    } else if (e.key === 'Escape') {
      setOptionClicked(false);
      setIsEditing(false);
    } else {
      setOptionClicked(false);
    }
  };

  useEffect(() => {
    setInnerSearchOption(searchOption);
  }, [searchOption]);

  //on scroll remove the dropdown
  useEffect(() => {
    const scrollListener = () => {
      setIsEditing(false);
    };

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [setIsEditing]);

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
            {loading ? (
              <LoadingIcon className={iconColorClass} />
            ) : (
              <MonoSearch className={iconColorClass} />
            )}

            <input
              ref={ref}
              type="text"
              placeholder="Search the Kadena Blockchain on"
              defaultValue={searchQuery}
              onFocus={() => setIsEditing(true)}
              onClick={() => setIsEditing(true)}
              onChange={(e) => handleSearchValueChange(e)}
              className={searchInputClass}
            />
            {isEditing && innerSearchOption === null && (
              <Stack className={searchBadgeBoxClass}>Search by</Stack>
            )}

            {innerSearchOption !== null && (
              <Stack
                gap="xs"
                as="button"
                className={classNames(
                  searchBadgeBoxClass,
                  searchBadgeBoxSelectedClass,
                )}
                onClick={() => {
                  setOptionClicked(false);
                  setInnerSearchOption(null);
                  handleSearch(null);
                }}
              >
                {searchData[innerSearchOption].title}
                <Stack as="span">x</Stack>
              </Stack>
            )}
          </Stack>

          {isEditing && (
            <Stack flexDirection="column" className={editingBoxClass}>
              {searchData?.map((item, index) => (
                <Stack
                  className={classNames(editOptionClass, {
                    [editOptionHoverClass]: editHover === index,
                  })}
                  key={index}
                  onMouseDown={() => setOptionClicked(true)}
                  onMouseEnter={() => setEditHover(index)}
                  onMouseLeave={() => setEditHover(null)}
                  onClick={() => {
                    setInnerSearchOption(index);
                    setIsEditing(false);
                    setOptionClicked(false);
                    handleSearch(index);
                  }}
                >
                  <Stack>In {item.title}</Stack>
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
