import React from 'react';

import type { ICardProps } from '@kadena/react-ui';
import { Card, ProgressCircle } from '@kadena/react-ui';
import { containerStyle } from './styles.css';

export const LoadingCard = ({
  isLoading,
  children,
  ...rest
}: ICardProps & { isLoading?: boolean }) => {
  return (
    <Card {...rest}>
      {isLoading && (
        <div className={containerStyle}>
          <ProgressCircle isIndeterminate />
        </div>
      )}
      {children}
    </Card>
  );
};
