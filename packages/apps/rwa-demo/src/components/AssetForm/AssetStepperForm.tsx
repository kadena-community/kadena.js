import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useGetPrincipalNamespace } from '@/hooks/getPrincipalNamespace';
import type { IAddContractProps } from '@/services/createContract';
import { MonoAdd, MonoKeyboardArrowLeft } from '@kadena/kode-icons';
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
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
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
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm<IAddContractProps>({
    mode: 'onChange',
    values: {
      contractName: 'sdf',
      namespace: namespace ?? '',
    },
  });

  useEffect(() => {
    if (!namespace) return;

    reset({
      contractName: '',
      namespace: namespace ?? '',
    });
  }, [namespace]);

  const handleSave = async (data: IAddContractProps) => {
    setError('');
    if (!data.namespace) {
      setError('there was an issue creating the namespace');

      return;
    }

    const tx = await submitContract(data);

    if (tx) {
      setStep(STEPS.DONE);
      const asset = addAsset({
        contractName: data.contractName,
        namespace: data.namespace,
      });

      if (!asset) return;
      setAsset(asset);
      window.location.href = '/';
    }
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
                required: {
                  value: true,
                  message: 'There seems to be a problem with the namespace',
                },
                pattern: {
                  value: /^n_[a-f0-9]{40}$/,
                  message: 'There seems to be a problem with the namespace',
                },
              }}
              render={({ field }) => (
                <TextField
                  data-testid="namespaceField"
                  label="Namespace"
                  isDisabled
                  isInvalid={!!errors.namespace?.message}
                  errorMessage={`${errors.namespace?.message}`}
                  {...field}
                />
              )}
            />

            <Controller
              name="contractName"
              control={control}
              rules={{
                required: true,
                maxLength: {
                  value: 40,
                  message: 'Max length of 40',
                },
                pattern: {
                  value: /^[a-z][a-z0-9_-]{0,39}$/i,
                  message: "Can't start with a number",
                },
              }}
              render={({ field }) => (
                <TextField
                  data-testid="contractNameField"
                  id="contractName"
                  label="Contract Name"
                  maxLength={40}
                  isInvalid={!!errors.contractName?.message}
                  errorMessage={`${errors.contractName?.message}`}
                  {...field}
                />
              )}
            />

            <Stack
              width="100%"
              justifyContent="flex-end"
              alignItems="center"
              gap="xs"
            >
              <Button
                onPress={() => setStep(STEPS.START)}
                variant="transparent"
                startVisual={<MonoKeyboardArrowLeft />}
              >
                Back
              </Button>
              <Button
                isDisabled={!isValid || !isAllowed}
                type="submit"
                startVisual={
                  <TransactionTypeSpinner
                    type={TXTYPES.CREATECONTRACT}
                    fallbackIcon={<MonoAdd />}
                  />
                }
              >
                Create the contract
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Stack>
  );
};
