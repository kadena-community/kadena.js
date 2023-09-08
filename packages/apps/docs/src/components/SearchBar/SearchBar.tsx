import { TextField } from '@kadena/react-ui';

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
        <TextField
          inputProps={{
            id: 'seachinput',
            onKeyUp: handleKeyUp,
            outlined: true,
            ref: ref,
            defaultValue: query,
            placeholder: 'Search',
            rightIcon: 'Magnify',
            'aria-label': 'Search',
          }}
        />
      </form>
    );
  },
);

SearchBar.displayName = 'SearchBar';
