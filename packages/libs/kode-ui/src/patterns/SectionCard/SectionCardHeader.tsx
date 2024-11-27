import type { FC, ReactElement } from 'react';
import React from 'react';
import { Heading, Stack, Text } from './../../components';
import type { ISectionCardProps } from './SectionCard';
import { actionsClass, headerClass, headerDescriptionClass } from './style.css';

export interface ISectionCardHeaderProps {
  title: string;
  description?: ReactElement;
  actions?: ReactElement;
  position?: ISectionCardProps['position'];
  variant?: ISectionCardProps['variant'];
}

export const SectionCardHeader: FC<ISectionCardHeaderProps> = ({
  title,
  description,
  actions,
  position,
  variant,
}) => {
  return (
    <Stack
      className={headerClass({ position, variant })}
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
          className={actionsClass({ position })}
          style={{ gridArea: 'actions' }}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  );
};
