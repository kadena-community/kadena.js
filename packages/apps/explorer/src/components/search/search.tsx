import { truncateValues } from '@/services/format';
import { MonoSearch } from '@kadena/react-icons/system';
import { Badge, Box } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React, { useState } from 'react';

export type SearchItemTitle =
  | 'Account'
  | 'Request Key'
  | 'Block Height'
  | 'Block Hash'
  | 'Events';

export interface ISearchItem {
  title: SearchItemTitle;
  disabled?: boolean;
}
interface ISearchComponentProps {
  placeholder: string;
  searchItems: ISearchItem[];
}

const SearchCombobox: React.FC<ISearchComponentProps> = ({
  placeholder,
  searchItems,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchOption, setSearchOption] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [optionClicked, setOptionClicked] = useState(false);
  const [escapePressed, setEscapePressed] = useState(false);

  const setOptionsDisabledExcept = (exceptIndex: number): void => {
    searchItems.forEach((item, index) => {
      if (index !== exceptIndex) {
        item.disabled = true;
      }
    });
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
      return 'Block Height';
    }

    return undefined;
  };

  const enableAllOptions = (): void => {
    searchItems.forEach((item) => {
      item.disabled = false;
    });
  };

  const handleSearch = (value: string, option: number | null): void => {};

  const handleSearchValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchValue(e.target.value);

    if (escapePressed || optionClicked) return;

    const inferedOption = inferOption(e.target.value);
    if (inferedOption === 'Account') {
      setSearchOption(0);
      setOptionsDisabledExcept(0);
    }
    if (inferedOption === 'Request Key') {
      setSearchOption(1);
      setOptionsDisabledExcept(1);
    }

    if (inferedOption === 'Block Height') {
      setSearchOption(2);
      setOptionsDisabledExcept(2);
    }

    if (!inferedOption || inferedOption === undefined) {
      setSearchOption(null);
      enableAllOptions();
    }
  };

  const handleSearchValueKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
  ): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchOption((prev) =>
        prev === null ? 0 : Math.min(prev + 1, searchItems.length - 1),
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchOption((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      setEscapePressed(false);
      setOptionClicked(false);
      handleSearch(searchValue, searchOption);
    } else if (e.key === 'Escape') {
      setOptionClicked(false);
      setSearchOption(null);
      setEscapePressed(true);
      enableAllOptions();
    }
  };

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
          style={{
            width: 515,
          }}
        >
          <MonoSearch />

          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => handleSearchValueChange(e)}
            onFocus={() => setIsEditing(true)}
            className={atoms({
              backgroundColor: 'base.default',
              fontSize: 'md',
              fontFamily: 'primaryFont',
              outline: 'none',
            })}
            style={{
              width: 350,
              height: 50,
              border: 'none',
            }}
          />

          {searchOption !== null && (
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              style={{
                width: 120,
              }}
            >
              <Badge size="lg">{searchItems[searchOption].title}</Badge>
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
            {searchItems.map((item, index) => (
              <Box
                key={index}
                onMouseDown={() => setOptionClicked(true)}
                onClick={() => {
                  if (!item.disabled) {
                    setSearchOption(index);
                    setIsEditing(false);
                  }
                }}
                style={{
                  gridTemplateColumns: '1fr 3fr',
                  borderLeft: index === searchOption ? 'solid' : 'none',
                }}
                className={atoms({
                  display: 'grid',
                  alignItems: 'flex-start',
                  paddingInlineStart: 'md',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  backgroundColor:
                    index === searchOption ? 'base.@active' : 'base.default',
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
