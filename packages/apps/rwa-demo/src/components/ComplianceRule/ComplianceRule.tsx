import { MonoArrowRightAlt } from '@kadena/kode-icons';
import { Badge, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect } from 'react';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';
import { complianceRuleClass } from './style.css';

interface IProps {
  value: number | string;
  label: string;
}

export const ComplianceRule: FC<IProps> = ({ label, value }) => {
  useEffect(() => {}, []);

  return (
    <Stack
      className={complianceRuleClass}
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack gap="sm" alignItems="center">
        <MonoArrowRightAlt />
        <Text>{label}</Text>
      </Stack>
      <Stack alignItems="center" gap="sm">
        <TransactionTypeSpinner type={TXTYPES.SETCOMPLIANCE} />
        <Badge style="positive" size="sm">
          {`${value.toString()}`}
        </Badge>
      </Stack>
    </Stack>
  );
};
