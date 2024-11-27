import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Heading, Stack, Text } from './../../components';
import { token } from './../../styles';
import type { ISectionCardProps } from './SectionCard';
import { bodyClass, headerDescriptionClass } from './style.css';

export interface ISectionCardBodyProps extends PropsWithChildren {
  title?: string;
  description?: string;
  variant?: ISectionCardProps['variant'];
}

export const SectionCardBody: FC<ISectionCardBodyProps> = ({
  children,
  title,
  description,
  variant,
}) => {
  return (
    <Stack
      className={bodyClass({ variant })}
      flexDirection="column"
      width="100%"
    >
      {variant === 'main' && (
        <Stack style={{ paddingBlockStart: token('spacing.sm') }} />
      )}

      {title && (
        <Heading as="h3" variant="h4">
          {title}
        </Heading>
      )}
      {description && (
        <Stack style={{ gridArea: 'description' }}>
          <Text variant="body" className={headerDescriptionClass}>
            {description}
          </Text>
        </Stack>
      )}
      {children}
    </Stack>
  );
};
