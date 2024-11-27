import { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { Card } from './../../components';
import { IconWrapper } from './IconWrapper';
import { SectionCardContentBlock } from './SectionCardContentBlock';
import { cardClass, iconWrapperClass } from './style.css';

type ContentTypeVariants = NonNullable<RecipeVariants<typeof iconWrapperClass>>;

export interface ISectionCardProps
  extends PropsWithChildren,
    ContentTypeVariants {
  stack?: 'horizontal' | 'vertical';
  variant?: 'main' | 'base';
  icon?: ReactElement;
  isLoading?: boolean;
}

export const SectionCard: FC<ISectionCardProps> = ({
  children,
  stack = 'horizontal',
  variant = 'base',
  icon,
  intent,
  isLoading = false,
}) => {
  return (
    <Card className={cardClass}>
      <IconWrapper
        icon={icon}
        intent={intent}
        variant={variant}
        isLoading={isLoading}
      />
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== SectionCardContentBlock)
        )
          return null;

        return React.cloneElement(child, { ...child.props, stack, variant });
      })}
    </Card>
  );
};
