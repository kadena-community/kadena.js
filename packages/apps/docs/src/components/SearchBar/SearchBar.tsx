import { Input } from '@kadena/react-ui';

import { searchFormClass } from './styles.css';

import type { FC, FormEvent, ForwardedRef, KeyboardEvent } from 'react';
import React, { forwardRef } from 'react';

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
        <Input
          id="seachinput"
          rightIcon="Magnify"
          onKeyUp={handleKeyUp}
          placeholder="Search"
          outlined
          ref={ref}
          defaultValue={query}
          type="text"
          aria-label="Search"
        />
      </form>
    );
  },
);

SearchBar.displayName = 'SearchBar';
