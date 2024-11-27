import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from './../../components';
import { ISectionCardProps } from './SectionCard';
import { SectionCardBody } from './SectionCardBody';
import { SectionCardHeader } from './SectionCardHeader';
import { blockClass } from './style.css';

export interface ISectionCardContentBlockProps extends PropsWithChildren {
  variant?: ISectionCardProps['variant'];
}

export const SectionCardContentBlock: FC<ISectionCardContentBlockProps> = ({
  children,
  variant,
}) => {
  return (
    <Stack className={blockClass({ variant })}>
      {React.Children.map(children, (child) => {
        console.log(child);
        if (
          !React.isValidElement(child) ||
          (Boolean(child) &&
            child.type !== SectionCardHeader &&
            child.type !== SectionCardBody)
        )
          return null;

        return React.cloneElement(child, { ...child.props, variant });
      })}
    </Stack>
  );
};
