import React from 'react';

import type { ICardProps } from '@kadena/react-ui';
import { Card, ProgressCircle } from '@kadena/react-ui';
import { containerStyle, loaderStyle } from './styles.css';

export const LoadingCard = ({
  isLoading,
  children,
  ...rest
}: ICardProps & { isLoading?: boolean }) => {
  return (
    <Card {...rest}>
      {isLoading && (
        <div className={containerStyle}>
          <ProgressCircle isIndeterminate className={loaderStyle} />
        </div>
      )}
      {children}
    </Card>
  );
};
