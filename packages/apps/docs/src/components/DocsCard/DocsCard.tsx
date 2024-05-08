import { Box, Heading } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { cardClass, descriptionWrapperClass } from './styles.css';

interface IProps extends PropsWithChildren {
  label: string;
  description: string;
}

export const DocsCard: FC<IProps> = ({ children, label, description }) => {
  return (
    <section className={cardClass}>
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
