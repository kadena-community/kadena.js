import type { ModuleModel } from '@/hooks/use-module-query';
import { Badge, Stack, Text } from '@kadena/react-ui';
import { monospaceSmallestRegular } from '@kadena/react-ui/styles';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import {
  chainBadgeStyles,
  hashBadgeStyles,
  statusbarStyles,
  statusbarTextStyles,
} from './styles.css';

const StatusBar: FC<{ module: ModuleModel }> = ({ module }) => {
  const { t } = useTranslation('common');

  const [namespace, moduleName] = module.name.split('.');

  return (
    <Stack
      gap="sm"
      alignItems={'center'}
      className={statusbarStyles}
      paddingInline="sm"
      paddingBlock="xs"
    >
      <Text bold size="smallest">
        {t('namespace')}
      </Text>
      <Text size="smallest" className={statusbarTextStyles}>
        {moduleName ? namespace : '—'}
      </Text>
      <Text bold size="smallest">
        {t('module')}
      </Text>
      <Text size="smallest" className={statusbarTextStyles}>
        {moduleName ?? module.name}
      </Text>
      <Badge
        size="sm"
        style="highContrast"
        className={chainBadgeStyles}
      >{`Chain ${module.chainId}`}</Badge>
      {module.hash ? (
        <>
          <Text size="smallest">#</Text>
          <Badge
            size="sm"
            style="warning"
            className={classNames(monospaceSmallestRegular, hashBadgeStyles)}
          >
            {module.hash}
          </Badge>
        </>
      ) : null}
      <Badge size="sm" style="info">
        {module.networkId}
      </Badge>
    </Stack>
  );
};

export default StatusBar;
