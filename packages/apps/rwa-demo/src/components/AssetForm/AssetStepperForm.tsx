import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useGetPrincipalNamespace } from '@/hooks/getPrincipalNamespace';
import type { IAddContractProps } from '@/services/createContract';
import {
  Button,
  Notification,
  NotificationHeading,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { AddExistingAssetForm } from './AddExistingAssetForm';

interface IProps {
  handleDone?: () => void;
}

const STEPS = {
  START: 0,
  CREATE_CONTRACT: 1,
  DONE: 2,
} as const;

export const AssetStepperForm: FC<IProps> = ({ handleDone }) => {
  const [step, setStep] = useState<number>(STEPS.START);
  const { addAsset, setAsset } = useAsset();
  const { data: namespace } = useGetPrincipalNamespace();
  const { submit: submitContract, isAllowed } = useCreateContract();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<IAddContractProps>({
    values: {
      contractName: '',
      namespace: namespace ?? '',
    },
  });

  useEffect(() => {
    if (!namespace) return;

    reset({
      contractName: '',
      namespace,
    });
  }, [namespace]);

  const handleSave = async (data: IAddContractProps) => {
    setError('');
    if (!data.namespace) {
      setError('there was an issue creating the namespace');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const tx = await submitContract(data);
    if (tx?.result?.status === 'success') {
      setStep(STEPS.DONE);
      const asset = addAsset({
        contractName: data.contractName,
        namespace: data.namespace,
      });
      if (!asset) return;
      setAsset(asset);
      window.location.href = '/';
    }
    setIsLoading(false);
  };

  return (
    <Stack width="100%" flexDirection="column" alignItems="center">
      {error && (
        <Notification role="alert">
          <NotificationHeading>There was an issue</NotificationHeading>
          {error}
        </Notification>
      )}

      {step === STEPS.START && (
        <Stack flexDirection="column" gap="sm">
          <AddExistingAssetForm handleDone={handleDone} />
          <Stack width="100%" justifyContent="center">
            <Text bold>or</Text>
          </Stack>
          <Button
            isDisabled={!isAllowed}
            variant="outlined"
            onPress={async () => {
              setStep(STEPS.CREATE_CONTRACT);
            }}
          >
            Start New Asset
          </Button>
        </Stack>
      )}

      {step === STEPS.DONE && (
        <Button
          onPress={async () => {
            router.replace('/assets');
            router.refresh();
            if (handleDone) handleDone();
          }}
        >
          DONE
        </Button>
      )}

      {step === STEPS.CREATE_CONTRACT && (
        <form onSubmit={handleSubmit(handleSave)} style={{ width: '100%' }}>
          <Stack flexDirection="column" gap="sm" width="100%">
            <Controller
              name="namespace"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField label="Namespace" isDisabled {...field} />
              )}
            />

            <Controller
              name="contractName"
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /^\S*$/gi,
                  message: 'no spaces allowed',
                },
              }}
              render={({ field }) => (
                <TextField label="Contract Name" {...field} />
              )}
            />

            <Stack width="100%" justifyContent="center" alignItems="center">
              {isLoading ? (
                <TransactionPendingIcon />
              ) : (
                <Button
                  isDisabled={!isValid || isLoading || !isAllowed}
                  type="submit"
                >
                  Create the contract
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      )}
    </Stack>
  );
};
