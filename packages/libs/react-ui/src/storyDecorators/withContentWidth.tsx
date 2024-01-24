/*
  This Decorator can place the story on a colored layer from the design system.
  More info: https://storybook.js.org/docs/react/writing-stories/decorators
*/
import type { Decorator } from '@storybook/react';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { atoms } from '../styles/atoms.css';
import { minWidth } from './storyDecorators.css';

interface IWithContentWidthProps {
  children: React.ReactNode;
}
const WithContentWidth: FC<IWithContentWidthProps> = ({ children }) => {
  return (
    <div
      className={classNames(atoms({ maxWidth: 'content.maxWidth' }), minWidth)}
    >
      {children}
    </div>
  );
};

export const withContentWidth: Decorator = (story) => (
  <WithContentWidth>{story()}</WithContentWidth>
);
