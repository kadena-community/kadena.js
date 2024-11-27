import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Card } from './../../components';
import { SectionCardContentBlock } from './SectionCardContentBlock';
import { cardClass } from './style.css';

export interface ISectionCardProps extends PropsWithChildren {
  variant?: 'horizontal' | 'vertical';
}

export const SectionCard: FC<ISectionCardProps> = ({
  children,
  variant = 'horizontal',
}) => {
  return (
    <Card className={cardClass}>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== SectionCardContentBlock)
        )
          return null;

        return React.cloneElement(child, { ...child.props, variant });
      })}
    </Card>
  );
};
