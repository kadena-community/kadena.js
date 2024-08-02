import React from 'react';
import { Card } from '../../components';
import { container, paddingContainer } from './CardPattern.css';

export const CardFixedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={paddingContainer}>
      <Card className={container}>{children}</Card>
    </div>
  );
};
