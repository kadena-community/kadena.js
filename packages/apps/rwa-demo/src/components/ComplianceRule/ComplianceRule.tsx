import { useSetCompliance } from '@/hooks/setCompliance';
import type { IComplianceRuleTypes } from '@/services/getComplianceRules';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Badge, Button, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { Confirmation } from '../Confirmation/Confirmation';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';
import { complianceRuleClass } from './style.css';

interface IProps {
  ruleKey: IComplianceRuleTypes;
  value: number | string;
  label: string;
  isActive: boolean;
  onToggle: (rule: IComplianceRuleTypes, newState: boolean) => void;
}

export const ComplianceRule: FC<IProps> = ({
  label,
  value,
  isActive,
  onToggle,
  ruleKey,
}) => {
  const { isAllowed } = useSetCompliance();

  const handleToggle = () => {
    onToggle(ruleKey, !isActive);
  };

  return (
    <Stack
      className={complianceRuleClass}
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack gap="sm" alignItems="center">
        <Confirmation
          onPress={handleToggle}
          trigger={
            <Button
              isDisabled={!isAllowed}
              isCompact
              variant="outlined"
              endVisual={
                <TransactionTypeSpinner
                  type={TXTYPES.SETCOMPLIANCERULE}
                  fallbackIcon={isActive ? <MonoPlayArrow /> : <MonoPause />}
                />
              }
            />
          }
        >
          Are you sure you want to {isActive ? 'disable' : 'enable'} this rule?
        </Confirmation>
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
