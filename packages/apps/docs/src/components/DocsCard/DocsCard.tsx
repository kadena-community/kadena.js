import { Box, Heading } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { backgroundVariant, cardClass, cardVariants } from './styles.css';

interface IProps extends PropsWithChildren {
  label: string;
  description: string;
  schema?: 'info' | 'warning' | 'success';
  background:
    | 'whitepapers'
    | 'contribute'
    | 'quickstart'
    | 'smartwallet'
    | 'react'
    | 'marmalade'
    | 'default';
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
        <div>{description}</div>
      </Box>
      {children}
    </section>
  );
};
