import { ComboField } from '@/Components/ComboField/ComboField';
import { Fungible } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { wrapperClass } from '@/pages/errors/styles.css';
import { MonoSwipeRightAlt } from '@kadena/kode-icons/system';
import { Card, Stack, Text } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import { FC, useMemo } from 'react';
import { UseFormReset } from 'react-hook-form';
import { ITransfer } from '../TransferForm';
import { itemClass } from './style.css';

interface IProps {
  defaultValues: Record<any, any>;
  fungibles: Fungible[];
  selectedContract: string;
  reset: UseFormReset<ITransfer>;
}

export const TransferCard: FC<IProps> = ({
  fungibles,
  selectedContract,
  reset,
  defaultValues,
}) => {
  const handleSetFungible = (fungible: string) => {
    reset({ ...defaultValues, fungible: fungible });
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

  const selectedAsset = assets.find(
    (asset) => asset.contract === selectedContract,
  );

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
          <ComboField
            fontType="code"
            value={selectedAsset?.symbol}
            label="Asset"
            aria-label="Asset"
          >
            {({ close }) => {
              return (
                <Stack flexDirection="column" gap="xs">
                  {assets.map((value) => (
                    <Stack
                      width="100%"
                      className={itemClass}
                      key={value.symbol}
                      onClick={() => {
                        handleSetFungible(value.contract);
                        close();
                      }}
                    >
                      <Text size="small" variant="code">
                        {value.symbol}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              );
            }}
          </ComboField>
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
