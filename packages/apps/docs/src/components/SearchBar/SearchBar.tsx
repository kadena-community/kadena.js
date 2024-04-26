import { SystemIcon, TextField } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import type {
  FormEvent,
  ForwardRefExoticComponent,
  ForwardedRef,
  KeyboardEvent,
  RefAttributes,
} from 'react';
import React, { forwardRef, useEffect, useState } from 'react';
import { buttonClass, searchFormClass } from './styles.css';

interface IProps {
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSubmit?: (evt: FormEvent<HTMLFormElement>) => void;
  query?: string;
  ref?: ForwardedRef<HTMLInputElement>;
}

export const SearchBar: ForwardRefExoticComponent<
  Omit<IProps, 'ref'> & RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, IProps>(
  // eslint-disable-next-line react/prop-types
  ({ onSubmit = () => {}, onKeyUp = () => {}, query }, ref) => {
    const MagnifierIcon = SystemIcon.Magnify;
    const [innerQuery, setInnerQuery] = useState(query);

    useEffect(() => {
      setInnerQuery(query);
    }, [query]);

    const handleChange = (e: KeyboardEvent<HTMLInputElement>): void => {
      e.preventDefault();
      setInnerQuery(e.currentTarget.value);
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
          onChange={handleChange}
          placeholder="Search"
          name="search"
          ref={ref}
          value={innerQuery}
          type="text"
          aria-label="Search"
          endAddon={
            <button type="submit" className={buttonClass}>
              <MagnifierIcon />
            </button>
          }
        />
      </form>
    );
  },
);

SearchBar.displayName = 'SearchBar';
