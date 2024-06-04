import type { ModuleModel } from '@/hooks/use-module-query';
import { Badge, Stack, Text } from '@kadena/react-ui';
import { ellipsis } from '@kadena/react-ui/styles';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import {
  chainBadgeStyles,
  hashBadgeStyles,
  statusbarStyles,
} from './styles.css';

const StatusBar: FC<{ module: ModuleModel }> = ({ module }) => {
  const { t } = useTranslation('common');

  const [namespace, moduleName] = module.name.split('.');

  return (
    <Stack gap="sm" alignItems={'center'} className={statusbarStyles}>
      <Text bold>{t('namespace')}</Text>
      <Text>{moduleName ? namespace : t('N/A')}</Text>
      <Text bold>{t('module')}</Text>
      <Text>{moduleName ?? module.name}</Text>
      <Badge
        size="sm"
        style="highContrast"
        className={chainBadgeStyles}
      >{`Chain ${module.chainId}`}</Badge>
      <Text>#</Text>
      <Badge
        size="sm"
        style="warning"
        // className={classNames(ellipsis, hashBadgeStyles)}
      >
        {module.hash!}
      </Badge>
      <Badge size="sm" style="info">
        {module.networkId}
      </Badge>
    </Stack>
  );
};

export default StatusBar;
