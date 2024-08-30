import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import {
  asideContentBlockClass,
  asideContentBlockLabelClass,
} from '../styles.css';

interface IProps {
  isLoading: boolean;
  label: string;
  body: string;
}

export const LayoutAsideContentBlock: FC<IProps> = ({
  isLoading,
  label,
  body,
}) => {
  return (
    <Stack flexDirection="column" className={asideContentBlockClass} gap="xs">
      <Text className={asideContentBlockLabelClass}>{label}</Text>
      <Stack gap="xs">
        <ValueLoader isLoading={isLoading}>
          <Text variant="code" bold>
            {body}
          </Text>
        </ValueLoader>
      </Stack>
    </Stack>
  );
};
