import { Box, Heading } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import {
  backgroundVariant,
  cardClass,
  cardVariants,
  descriptionWrapperClass,
} from './styles.css';

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
      <Heading as="h3" variant="h5" transform="uppercase">
        {label}
      </Heading>
      <Box marginBlock="md" className={descriptionWrapperClass}>
        {description}
      </Box>
      {children}
    </section>
  );
};
