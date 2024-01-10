import { Box, Heading } from '@kadena/react-ui';
import { sprinkles } from '@kadena/react-ui/theme';
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
      <Box
        marginBlock="md"
        className={sprinkles({
          marginInlineEnd: { sm: '$20', md: '$md', lg: '$20' },
        })}
      >
        <div>{description}</div>
      </Box>
      {children}
    </section>
  );
};
