import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from './../../components';
import type { ISectionCardProps } from './SectionCard';
import { SectionCardBody } from './SectionCardBody';
import { SectionCardHeader } from './SectionCardHeader';
import { blockClass } from './style.css';

export interface ISectionCardContentBlockProps extends PropsWithChildren {
  stack?: ISectionCardProps['stack'];
  variant?: ISectionCardProps['variant'];
}

export const SectionCardContentBlock: FC<ISectionCardContentBlockProps> = ({
  children,
  stack,
  variant,
}) => {
  return (
    <Stack className={blockClass({ stack })}>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) &&
            child.type !== SectionCardHeader &&
            child.type !== SectionCardBody)
        )
          return null;

        return React.cloneElement(child, { ...child.props, stack, variant });
      })}
    </Stack>
  );
};
