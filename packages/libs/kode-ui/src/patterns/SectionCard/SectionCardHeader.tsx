import type { FC, ReactElement } from 'react';
import React from 'react';
import { Heading, Stack, Text } from './../../components';
import type { ISectionCardProps } from './SectionCard';
import { actionsClass, headerClass, headerDescriptionClass } from './style.css';

export interface ISectionCardHeaderProps {
  title: string;
  description?: ReactElement;
  actions?: ReactElement;
  variant?: ISectionCardProps['variant'];
}

export const SectionCardHeader: FC<ISectionCardHeaderProps> = ({
  title,
  description,
  actions,
  variant,
}) => {
  return (
    <Stack className={headerClass({ variant })} flexDirection="column">
      <Stack style={{ gridArea: 'header' }}>
        <Heading as="h3" variant="h4">
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
          className={actionsClass({ variant })}
          style={{ gridArea: 'actions' }}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  );
};
