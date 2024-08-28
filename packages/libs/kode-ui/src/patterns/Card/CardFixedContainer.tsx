import cn from 'classnames';
import React from 'react';
import { Card } from '../../components';
import { container, paddingContainer } from './CardPattern.css';

export const CardFixedContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={paddingContainer}>
      <Card className={cn(container, className)} fullWidth>
        {children}
      </Card>
    </div>
  );
};
