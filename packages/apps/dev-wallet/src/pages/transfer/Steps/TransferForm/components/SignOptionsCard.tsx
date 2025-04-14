import { AssetAction } from '@/Components/Assets/ AssetAction';
import { actionsWrapperClass } from '@/Components/Assets/style.css';
import { wrapperClass } from '@/pages/errors/styles.css';
import { useShow } from '@/utils/useShow';
import {
  MonoLockOpen,
  MonoRedo,
  MonoSignature,
} from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  hasXChain: boolean;
  crossChainMode: 'x-chain' | 'redistribution';
  setValue: UseFormSetValue<ITransfer>;
  selectedType: 'safeTransfer' | 'normalTransfer';
  selectedTxType: 'x-chain' | 'redistribution';
  control: Control<ITransfer, any>;
}

export const SignOptionsCard: FC<IProps> = ({
  hasXChain,
  crossChainMode,
  setValue,
  selectedType,
  selectedTxType,
  control,
}) => {
  const [, setShowMore, AdvancedMode] = useShow(false);

  return (
    <Card fullWidth>
      <CardContentBlock
        level={2}
        title="Signing"
        visual={<MonoSignature width={24} height={24} />}
        supportingContent={
          <Stack width="100%" gap="sm">
            <Button
              isCompact
              variant="outlined"
              onPress={() => setShowMore((v) => !v)}
            >
              more Options
            </Button>
          </Stack>
        }
      >
        <Stack
          flexDirection="column"
          gap="md"
          marginBlockEnd="xxxl"
          className={wrapperClass}
        >
          <Heading as="h5">Transfer type</Heading>
          <Stack className={actionsWrapperClass}>
            <AssetAction
              label="Safe transfer"
              body={<MonoLockOpen />}
              handleClick={() => setValue('type', 'safeTransfer')}
              isSelected={selectedType === 'safeTransfer'}
            />
            <AssetAction
              label="Normal transfer"
              body={<MonoRedo />}
              handleClick={() => setValue('type', 'normalTransfer')}
              isSelected={selectedType === 'normalTransfer'}
            />
          </Stack>

          <AdvancedMode>
            <Stack marginBlockStart={'md'} marginBlockEnd={'sm'}>
              <Heading variant="h5">Transfer options</Heading>
            </Stack>

            <Controller
              control={control}
              name="xchainMode"
              render={() => (
                <>
                  <Stack className={actionsWrapperClass}>
                    <AssetAction
                      label="Cross chain transfer"
                      body={
                        <Text size="small">
                          Safe transfer doesn't support cross-chain transfer
                        </Text>
                      }
                      handleClick={() => setValue('xchainMode', 'x-chain')}
                      isSelected={selectedTxType === 'x-chain'}
                    />
                    <AssetAction
                      label="Redistribution"
                      body={
                        <Text size="small">
                          Redistribute balance first then do final transfer
                        </Text>
                      }
                      handleClick={() =>
                        setValue('xchainMode', 'redistribution')
                      }
                      isSelected={selectedTxType === 'redistribution'}
                    />
                  </Stack>
                </>
              )}
            />
          </AdvancedMode>

          {hasXChain &&
            crossChainMode === 'x-chain' &&
            selectedType === 'safeTransfer' && (
              <Notification role="alert" intent="warning">
                Note: You cant perform a cross-chain safe transfer. the
                transaction(s) will be created as normal transfer. if you want
                to do a safe transfer, please switch to redistribution mode
                <Stack gap="sm">
                  <Button
                    isCompact
                    variant="outlined"
                    onClick={() => {
                      setShowMore(true);
                      setValue('xchainMode', 'redistribution');
                    }}
                  >
                    Enable Redistribution
                  </Button>
                </Stack>
              </Notification>
            )}
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
