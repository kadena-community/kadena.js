import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useSetCompliance } from '@/hooks/setCompliance';
import type { IComplianceRuleTypes } from '@/services/getComplianceRules';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Badge, Stack, SwitchButton, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { Confirmation } from '../Confirmation/Confirmation';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { complianceRuleClass } from './style.css';

interface IProps {
  ruleKey: IComplianceRuleTypes;
  value: number | string;
  label: string;
  isActive: boolean;
  onToggle: (rule: IComplianceRuleTypes, newState: boolean) => void;
  'data-testid': string;
}

export const ComplianceRule: FC<IProps> = ({
  label,
  value,
  isActive,
  onToggle,
  ruleKey,
  'data-testid': dataTestId,
}) => {
  const { isAllowed } = useSetCompliance();

  const handleToggle = () => {
    onToggle(ruleKey, !isActive);
  };

  return (
    <Stack
      data-testid={dataTestId}
      className={complianceRuleClass}
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack gap="sm" alignItems="center">
        <Confirmation
          onPress={handleToggle}
          trigger={
            <SwitchButton
              isDisabled={!isAllowed}
              isSelected={isActive}
              onVisual={
                <TransactionTypeSpinner
                  type={TXTYPES.SETCOMPLIANCERULE}
                  fallbackIcon={<MonoPlayArrow />}
                />
              }
              offVisual={
                <TransactionTypeSpinner
                  type={TXTYPES.SETCOMPLIANCERULE}
                  fallbackIcon={<MonoPause />}
                />
              }
            />
          }
        >
          Are you sure you want to {isActive ? 'disable' : 'enable'} this rule?
        </Confirmation>
        <Text>{label}</Text>
      </Stack>
      <Stack alignItems="center" gap="sm" data-testid="compliance-text">
        <TransactionTypeSpinner type={TXTYPES.SETCOMPLIANCE} />
        <Badge style="positive" size="sm">
          {`${value.toString()}`}
        </Badge>
      </Stack>
    </Stack>
  );
};
