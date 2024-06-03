import type { ModuleModel } from '@/hooks/use-module-query';
import { Badge, Stack, Text } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import { statusbarStyles } from './styles.css';

const StatusBar: FC<{ module: ModuleModel }> = ({ module }) => {
  const { t } = useTranslation('common');
  return (
    <Stack gap="sm" alignItems={'center'} className={statusbarStyles}>
      <Text bold>{t('namespace')}</Text>
      <Text>{t('N/A')}</Text>
      <Text bold>{t('module')}</Text>
      <Text>{module.name}</Text>
      <Badge size="sm" style="highContrast">{`Chain ${module.chainId}`}</Badge>
      <Text>#</Text>
      <Badge size="sm" style="warning">
        {module.hash}
      </Badge>
      <Badge size="sm" style="info">
        {module.networkId}
      </Badge>
    </Stack>
  );
};

export default StatusBar;
