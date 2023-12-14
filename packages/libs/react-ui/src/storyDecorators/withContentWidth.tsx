/*
  This Decorator can place the story on a colored layer from the design system.
  More info: https://storybook.js.org/docs/react/writing-stories/decorators
*/
import type { Decorator } from '@storybook/react';
import { atoms } from '@theme/atoms.css';
import type { FC } from 'react';
import React from 'react';

interface IWithContentWidthProps {
  children: React.ReactNode;
}
const WithContentWidth: FC<IWithContentWidthProps> = ({ children }) => {
  return (
    <div
      className={atoms({
        maxWidth: 'content.maxWidth',
        minWidth: 'content.minWidth',
      })}
    >
      {children}
    </div>
  );
};

export const withContentWidth: Decorator = (story) => (
  <WithContentWidth>{story()}</WithContentWidth>
);
