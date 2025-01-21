import { INFINITE_COMPLIANCE } from '@/constants';
import { useAsset } from '@/hooks/asset';
import { MonoWarning } from '@kadena/kode-icons';
import { token } from '@kadena/kode-ui/styles';
import type { FC } from 'react';

interface IProps {
  balance: number;
}

export const MaxInvestorBalanceCheck: FC<IProps> = ({ balance }) => {
  const { asset } = useAsset();

  if (!asset) return null;

  if (
    asset?.compliance.maxBalance.value < balance &&
    asset?.compliance.maxBalance.value > INFINITE_COMPLIANCE
  )
    return (
      <MonoWarning
        style={{ color: token('color.icon.semantic.warning.default') }}
        title={`The balance of this investor is higher than the allowed compliance max balance (${asset.compliance.maxBalance.value})`}
      />
    );

  return null;
};
