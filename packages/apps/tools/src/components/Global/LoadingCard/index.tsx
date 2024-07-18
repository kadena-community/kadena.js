import React from 'react';

import type { ICardProps } from '@kadena/kode-ui';
import { Card, ProgressCircle } from '@kadena/kode-ui';
import useTranslation from 'next-translate/useTranslation';
import { containerStyle } from './styles.css';

export const LoadingCard = ({
  isLoading,
  children,
  ...rest
}: ICardProps & { isLoading?: boolean }) => {
  const { t } = useTranslation('common');
  return (
    <Card {...rest}>
      {isLoading && (
        <div className={containerStyle}>
          <ProgressCircle isIndeterminate label={t('Loading')} />
        </div>
      )}
      {children}
    </Card>
  );
};
