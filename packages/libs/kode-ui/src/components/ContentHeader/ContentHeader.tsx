import type { FC, ReactElement } from 'react';
import React from 'react';

import { Heading, Text } from '../Typography';
import { containerClass, descriptionClass } from './ContentHeader.css';

export interface IContentHeaderProps {
  icon: ReactElement;
  heading: string;
  description?: string;
}

export const ContentHeader: FC<IContentHeaderProps> = ({
  icon,
  heading,
  description,
}) => {
  return (
    <div className={containerClass}>
      {icon}
      <Heading as="h4">{heading}</Heading>
      {description ? (
        <div className={descriptionClass}>
          <Text as="p">{description}</Text>
        </div>
      ) : null}
    </div>
  );
};
