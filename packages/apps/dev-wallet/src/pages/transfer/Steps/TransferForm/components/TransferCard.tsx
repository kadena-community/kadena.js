import { AssetCards } from '@/Components/Assets/AssetCards';
import { Fungible } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { wrapperClass } from '@/pages/errors/styles.css';
import { MonoSwipeRightAlt } from '@kadena/kode-icons/system';
import { Card, Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import { FC, useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  fungibles: Fungible[];
  setValue: UseFormSetValue<ITransfer>;
  selectedContract: string;
}

export const TransferCard: FC<IProps> = ({
  fungibles,
  setValue,
  selectedContract,
}) => {
  const handleSetFungible = (fungible: string) => {
    setValue('fungible', fungible);
  };
  const { accounts } = useWallet();

  const assets = useMemo(() => {
    return fungibles.map((item) => {
      const acs = accounts.filter((a) => a.contract === item.contract);
      return {
        ...item,
        accounts: acs,
        balance: acs
          .reduce((acc, a) => acc.plus(a.overallBalance), new PactNumber(0))
          .toDecimal(),
      } as unknown as Fungible & { balance: number };
    });
  }, [accounts, fungibles]);

  return (
    <Card fullWidth>
      <CardContentBlock
        title="Transfer"
        visual={<MonoSwipeRightAlt width={36} height={36} />}
      >
        <Stack
          flexDirection="column"
          gap="xxl"
          marginBlockEnd="xxxl"
          className={wrapperClass}
        >
          <AssetCards
            assets={assets}
            onClick={handleSetFungible}
            selectedContract={selectedContract}
          />
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
