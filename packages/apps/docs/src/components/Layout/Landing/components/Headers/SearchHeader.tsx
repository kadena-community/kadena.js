import { GradientText, Heading, Stack } from '@kadena/react-ui';

import { headerClass, subheaderClass, wrapperClass } from './style.css';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const SearchHeader: FC<IProps> = ({ children }) => {
  return (
    <header className={headerClass}>
      <div className={wrapperClass}>
        <Heading as="h1" variant="h2">
          Search spaces
        </Heading>
        <Stack direction="column" gap="$2xs">
          <Heading as="h2" variant="h4">
            Traditional or the <GradientText>new</GradientText> way
          </Heading>
          <span className={subheaderClass}>
            Explore our content across spaces
          </span>
          {children}
        </Stack>
      </div>
    </header>
  );
};
