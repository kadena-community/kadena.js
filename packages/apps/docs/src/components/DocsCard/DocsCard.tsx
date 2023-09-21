import type { ProductIcon } from '@kadena/react-ui';
import { Box, Heading, Text } from '@kadena/react-ui';

import { backgroundVariant, cardClass, cardVariants } from './styles.css';

import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

interface IProps extends PropsWithChildren {
  label: string;
  description: string;
  schema?: 'info' | 'warning' | 'success';
  background: 'whitepapers' | 'contribute' | 'quickstart' | 'default';
}

export const DocsCard: FC<IProps> = ({
  children,
  label,
  description,
  schema = 'info',
  background = 'default',
}) => {
  return (
    <section
      className={classNames(
        cardClass,
        cardVariants[schema],
        backgroundVariant[background],
      )}
    >
      <Heading as="h3" variant="h5">
        {label}
      </Heading>
      <Box marginY="$4" marginRight={{ sm: '$20', md: '$4', lg: '$20' }}>
        <Text>{description}</Text>
      </Box>
      {children}
    </section>
  );
};
