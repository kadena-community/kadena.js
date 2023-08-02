import { SystemIcon } from '@components/Icon';
import { Heading, Text } from '@components/Typography';
import React, { FC } from 'react';
import { containerClass, descriptionClass } from './ContentHeader.css';

export interface IContentHeaderProps {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  heading: string;
  description?: string;
}

export const ContentHeader: FC<IContentHeaderProps> = ({
  icon: Icon,
  heading,
  description,
}) => {
  return (
    <div className={containerClass}>
      <Icon size="md" />
      <Heading as="h4">{heading}</Heading>
      {description ? (
        <div className={descriptionClass}>
          <Text as="p">{description}</Text>
        </div>
      ) : null}
    </div>
  );
};
