import { LoadingIcon } from '@/components/LoadingIcon/LoadingIcon';
import { SearchOptionEnum } from '@/hooks/search/utils/utils';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
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
  iconColorClass,
  searchBadgeBoxClass,
  searchBadgeBoxSelectedClass,
  searchBoxClass,
  searchBoxEditingClass,
  searchInputClass,
} from './searchComponent.css';

export type SearchItemTitle =
  | 'Account'
  | 'Request Key'
  | 'Height'
  | 'Block Hash'
  | 'Event';

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

const inferOption = (value: string): SearchOptionEnum => {
  if (
    value.toLocaleLowerCase().startsWith('k:') ||
    value.toLocaleLowerCase().startsWith('w:')
  ) {
    return SearchOptionEnum.ACCOUNT;
  } else if (value.includes('.')) {
    return SearchOptionEnum.EVENT;
  } else if (value.length === 43) {
    return SearchOptionEnum.REQUESTKEY;
  } else if (/^\d+$/.test(value)) {
    return SearchOptionEnum.BLOCKHEIGHT;
  }
  return SearchOptionEnum.ACCOUNT;
};

export const SearchComponent: React.FC<ISearchComponentProps> = ({
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
      setSearchOption(innerSearchOption);
    }

    setIsEditing(false);
    const value = ref.current?.value ?? '';
    if (setSearchQuery) setSearchQuery(value);

    analyticsEvent(EVENT_NAMES['click:search'], {
      q: value,
      so: `${searchOptionIdx ? searchOptionIdx : innerSearchOption}`,
    });
  };

  const handleSearchValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = e.target.value;
    if (!value) {
      setSearchOption(null);
      setIsEditing(false);
      return;
    }
    const option = inferOption(value);

    if (searchOption === null) {
      setInnerSearchOption(option);
    }
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
              placeholder="Search the Kadena Blockchain"
              defaultValue={searchQuery}
              onFocus={() => {
                const value = ref.current?.value;
                if (value) {
                  setIsEditing(true);
                }
              }}
              onClick={() => {
                const value = ref.current?.value;
                if (value) {
                  setIsEditing(true);
                }
              }}
              onChange={(e) => handleSearchValueChange(e)}
              className={searchInputClass}
            />
            {isEditing && innerSearchOption === null && (
              <Stack className={searchBadgeBoxClass}>Search by</Stack>
            )}

            {innerSearchOption !== null && (
              <Stack
                gap="xs"
                className={classNames(
                  searchBadgeBoxClass,
                  searchBadgeBoxSelectedClass,
                )}
              >
                {searchData[innerSearchOption].title}
              </Stack>
            )}
          </Stack>

          {isEditing && (
            <Stack flexDirection="column" className={editingBoxClass}>
              {searchData?.map((item, index) => (
                <Stack
                  className={classNames(editOptionClass, {
                    [editOptionHoverClass]: editHover === index,
                    [editOptionSelectedClass]: innerSearchOption === index,
                  })}
                  key={index}
                  onMouseDown={() => setOptionClicked(true)}
                  onMouseEnter={() => setEditHover(index)}
                  onMouseLeave={() => setEditHover(null)}
                  onClick={() => {
                    setSearchOption(index);
                    setOptionClicked(false);
                    handleSearch(index);
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
