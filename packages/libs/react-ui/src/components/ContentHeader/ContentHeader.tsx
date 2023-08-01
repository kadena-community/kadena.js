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
        <Text as="p" className={descriptionClass}>
          {description}
        </Text>
      ) : null}
    </div>
  );
};
