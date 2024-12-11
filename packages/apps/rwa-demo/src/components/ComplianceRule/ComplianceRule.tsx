import { MonoArrowRightAlt } from '@kadena/kode-icons';
import { Badge, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { complianceRuleClass } from './style.css';

interface IProps {
  value: number | string;
  label: string;
}

export const ComplianceRule: FC<IProps> = ({ label, value }) => {
  return (
    <Stack
      className={complianceRuleClass}
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack gap="sm">
        <MonoArrowRightAlt />
        <Text>{label}</Text>
      </Stack>
      <Badge style="positive" size="sm">
        {`${value.toString()} tokens`}
      </Badge>
    </Stack>
  );
};
