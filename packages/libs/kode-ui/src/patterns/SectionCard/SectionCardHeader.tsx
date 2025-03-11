import type { FC, ReactElement } from 'react';
import React from 'react';
import { Heading, Stack, Text } from './../../components';
import type { ISectionCardProps } from './SectionCard';
import { actionsClass, headerClass, headerDescriptionClass } from './style.css';

export interface ISectionCardHeaderProps {
  title: string;
  description?: ReactElement;
  actions?: ReactElement;
  stack?: ISectionCardProps['stack'];
  variant?: ISectionCardProps['variant'];
  background?: ISectionCardProps['background'];
}

export const SectionCardHeader: FC<ISectionCardHeaderProps> = ({
  title,
  description,
  actions,
  stack,
  variant,
  background,
}) => {
  return (
    <Stack
      className={headerClass({ stack, variant, background })}
      flexDirection="column"
    >
      <Stack style={{ gridArea: 'header' }}>
        <Heading
          as={variant === 'main' ? 'h2' : 'h3'}
          variant={variant === 'main' ? 'h2' : 'h3'}
        >
          {title}
        </Heading>
      </Stack>
      {description && (
        <Stack style={{ gridArea: 'description' }}>
          <Text variant="body" className={headerDescriptionClass}>
            {description}
          </Text>
        </Stack>
      )}
      {actions && (
        <Stack
          className={actionsClass({ stack })}
          style={{ gridArea: 'actions' }}
          gap="xs"
        >
          {actions}
        </Stack>
      )}
    </Stack>
  );
};
