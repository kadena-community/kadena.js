import { Stack } from '@kadena/react-components';
import { Heading } from '@kadena/react-ui';

import { StyledLinkList, StyledSection } from './styles';

import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

interface IProps {
  title?: string;
  children: ReactNode;
}

// eslint-disable-next-line react/prop-types
const BrowseSection: FC<IProps> = ({ children, title }) => {
  return (
    <StyledSection>
      <Stack direction="column">
        {Boolean(title) && <Heading as="h6">{title}</Heading>}
        <StyledLinkList>
          {React.Children.map(children, (child) => {
            if (
              !React.isValidElement(child) ||
              (child.type !== Link &&
                child.type !== 'a' &&
                child.props.href === undefined)
            ) {
              throw new Error('not a valid link');
            }
            return <li>{child}</li>;
          })}
        </StyledLinkList>
      </Stack>
    </StyledSection>
  );
};

export { BrowseSection };
