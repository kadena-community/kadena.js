import { AssetAction } from '@/Components/Assets/ AssetAction';
import { actionsWrapperClass } from '@/Components/Assets/style.css';
import { wrapperClass } from '@/pages/errors/styles.css';
import {
  MonoLockOpen,
  MonoRedo,
  MonoSignature,
} from '@kadena/kode-icons/system';
import { Button, Card, Heading, Notification, Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { FormState, UseFormSetValue } from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  error:
    | {
        target: 'from' | `receivers.${number}` | 'gas' | 'meta' | 'general';
        message: string;
      }
    | undefined;

  hasXChain: boolean;
  crossChainMode: 'x-chain' | 'redistribution';
  setValue: UseFormSetValue<ITransfer>;
  formState: FormState<ITransfer>;
  selectedType: 'safeTransfer' | 'normalTransfer';
}

export const SignOptionsCard: FC<IProps> = ({
  error,
  hasXChain,
  crossChainMode,
  setValue,
  formState,
  selectedType,
}) => {
  return (
    <Card fullWidth>
      <CardContentBlock
        level={2}
        title="Signing"
        visual={<MonoSignature width={24} height={24} />}
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
                      setValue('xchainMode', 'redistribution');
                    }}
                  >
                    Enable Redistribution
                  </Button>
                </Stack>
              </Notification>
            )}

          {(error || !formState.isValid) && formState.isSubmitted && (
            <Notification role="alert" intent="negative">
              Invalid Data, Please check the input(s) (
              {[...Object.keys(formState.errors), error?.target.split('.')[0]]
                .filter(Boolean)
                .join(', ')}
              )
            </Notification>
          )}
          <Stack
            alignItems={'flex-start'}
            gap="lg"
            marginBlockStart={'lg'}
            flexDirection={'column'}
          >
            {!!error && error.target === 'general' && (
              <Notification role="alert" intent="negative">
                {error.message}
              </Notification>
            )}
          </Stack>
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
