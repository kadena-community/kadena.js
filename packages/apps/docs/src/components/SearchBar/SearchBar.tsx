import { SystemIcon, TextField } from '@kadena/react-ui';
import type {
  ChangeEventHandler,
  FormEvent,
  ForwardRefExoticComponent,
  ForwardedRef,
  RefAttributes,
} from 'react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { buttonClass, searchFormClass } from './styles.css';

interface IProps {
  onSubmit?: (evt: FormEvent<HTMLFormElement>) => void;
  query?: string;
  ref?: ForwardedRef<HTMLInputElement>;
}

export const SearchBar: ForwardRefExoticComponent<
  Omit<IProps, 'ref'> & RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, IProps>(
  // eslint-disable-next-line react/prop-types
  ({ onSubmit = () => {}, query }, ref) => {
    const MagnifierIcon = SystemIcon.Magnify;
    const [innerQuery, setInnerQuery] = useState(query);
    const innerRef = useRef<HTMLInputElement>();

    useEffect(() => {
      setInnerQuery(query);
      innerRef.current?.focus();
    }, [innerRef, query]);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
      e.preventDefault();
      setInnerQuery(e.currentTarget.value);
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
          ref={innerRef}
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
