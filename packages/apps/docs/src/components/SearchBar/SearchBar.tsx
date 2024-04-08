import { MonoSearch } from '@kadena/react-icons';
import { TextField } from '@kadena/react-ui';
import type { FC, FormEvent, ForwardedRef, KeyboardEvent } from 'react';
import React, { forwardRef } from 'react';
import { searchFormClass } from './styles.css';

interface IProps {
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSubmit?: (evt: FormEvent<HTMLFormElement>) => void;
  query?: string;
  ref?: ForwardedRef<HTMLInputElement>;
}

export const SearchBar: FC<IProps> = forwardRef<HTMLInputElement, IProps>(
  // eslint-disable-next-line react/prop-types
  ({ onSubmit = () => {}, onKeyUp = () => {}, query }, ref) => {
    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
      e.preventDefault();
      onKeyUp(e);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit} className={searchFormClass}>
        {/* TODO: Replace with SearchField */}
        <TextField
          id="seachinput"
          onKeyUp={handleKeyUp}
          placeholder="Search"
          isOutlined
          ref={ref}
          defaultValue={query}
          type="text"
          aria-label="Search"
          endAddon={<MonoSearch />}
        />
      </form>
    );
  },
);

SearchBar.displayName = 'SearchBar';
