import { LoadingIcon } from '@/components/LoadingIcon/LoadingIcon';
import type { SearchOptionEnum } from '@/context/searchContext/utils/utils';
import {
  getSearchOptionByIndex,
  getSearchOptions,
  getSearchOptionTitle,
  SEARCHOPTIONS,
} from '@/context/searchContext/utils/utils';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { MonoSearch } from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  editingBoxClass,
  editOptionClass,
  editOptionHoverClass,
  editOptionSelectedClass,
  iconColorClass,
  searchBadgeBoxClass,
  searchBadgeBoxHeaderClass,
  searchBadgeBoxSelectedClass,
  searchBoxClass,
  searchBoxEditingClass,
  searchBoxWrapperClass,
  searchInputClass,
} from './searchComponent.css';

export type SearchItemTitle =
  | 'Account'
  | 'Request Key'
  | 'Height'
  | 'Block Hash'
  | 'Event';

export interface ISearchComponentProps {
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  searchQuery?: string;
  searchOption: SearchOptionEnum | null;
  setSearchOption: Dispatch<SetStateAction<SearchOptionEnum | null>>;
  loading: boolean;
  position?: 'header' | 'default';
}

const inferOption = (value: string): SearchOptionEnum => {
  if (
    value.toLocaleLowerCase().startsWith('k:') ||
    value.toLocaleLowerCase().startsWith('w:')
  ) {
    return SEARCHOPTIONS.ACCOUNT;
  } else if (value.includes('.')) {
    return SEARCHOPTIONS.EVENT;
  } else if (value.length === 43) {
    return SEARCHOPTIONS.REQUESTKEY;
  } else if (/^\d+$/.test(value)) {
    return SEARCHOPTIONS.BLOCKHEIGHT;
  }
  return SEARCHOPTIONS.ACCOUNT;
};

export const SearchComponent: React.FC<ISearchComponentProps> = ({
  position = 'default',
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
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    const value = e.currentTarget.value;

    if (!value) {
      setSearchOption(null);
      setInnerSearchOption(null);
      setSearchQuery && setSearchQuery('');
      setIsEditing(false);
      return;
    } else {
      const option = inferOption(value);

      if (searchOption === null) {
        setInnerSearchOption(option);
      }
    }
  };

  const handleSearchValueKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
  ): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setEditHover((prev) =>
        prev === null ? 0 : Math.min(prev + 1, getSearchOptions().length - 1),
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setEditHover((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setOptionClicked(false);
      handleSearch(getSearchOptionByIndex(editHover));
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setOptionClicked(false);
      setIsEditing(false);
    } else {
      setOptionClicked(false);
      setIsEditing(true);
    }
  };

  useEffect(() => {
    setInnerSearchOption(searchOption);
    if (ref.current) ref.current.value = searchQuery ?? '';
  }, [searchOption, searchQuery]);

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
        style={{ minHeight: position === 'default' ? '56px' : 'unset' }}
      >
        <Stack
          alignItems="flex-start"
          className={classNames(searchBoxWrapperClass, {
            [searchBoxEditingClass]: isEditing,
          })}
          // ugly hack to align the search in the header
          style={{ top: position === 'header' ? '-28px' : 0 }}
        >
          <Stack
            width="100%"
            alignItems="center"
            paddingInline="md"
            className={searchBoxClass}
          >
            {loading ? (
              <LoadingIcon className={iconColorClass} />
            ) : (
              <MonoSearch className={iconColorClass} />
            )}

            <input
              ref={ref}
              type="text"
              autoCapitalize="off"
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
              onKeyUp={(e) => handleSearchValueChange(e)}
              className={searchInputClass}
            />

            {isEditing && innerSearchOption === null && (
              <Stack
                className={classNames(searchBadgeBoxClass, {
                  [searchBadgeBoxHeaderClass]: position === 'header',
                })}
              >
                Search by
              </Stack>
            )}

            {innerSearchOption !== null && (
              <Stack
                gap="xs"
                className={classNames(
                  searchBadgeBoxClass,
                  searchBadgeBoxSelectedClass,
                  { [searchBadgeBoxHeaderClass]: position === 'header' },
                )}
              >
                {getSearchOptionTitle(innerSearchOption)}
              </Stack>
            )}
          </Stack>

          {isEditing && (
            <Stack flexDirection="column" className={editingBoxClass}>
              {getSearchOptions().map((item, index) => (
                <Stack
                  className={classNames(editOptionClass, {
                    [editOptionHoverClass]: editHover === index,
                    [editOptionSelectedClass]:
                      innerSearchOption === getSearchOptionByIndex(index),
                  })}
                  key={index}
                  onMouseDown={() => setOptionClicked(true)}
                  onMouseEnter={() => setEditHover(index)}
                  onMouseLeave={() => setEditHover(null)}
                  onClick={() => {
                    setSearchOption(getSearchOptionByIndex(index));
                    setOptionClicked(false);
                    handleSearch(getSearchOptionByIndex(index));
                  }}
                >
                  <Stack>{getSearchOptionTitle(item)}</Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};
