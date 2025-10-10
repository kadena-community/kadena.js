import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useGetPrincipalNamespace } from '@/hooks/getPrincipalNamespace';
import type { IAddContractProps } from '@/services/createContract';
import { MonoAdd, MonoKeyboardArrowLeft } from '@kadena/kode-icons';
import {
  Button,
  Divider,
  Notification,
  NotificationHeading,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';
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
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [step, setStep] = useState<number>(STEPS.START);
  const { addAsset, setAsset } = useAsset();
  const { data: namespace } = useGetPrincipalNamespace();
  const { submit: submitContract, isAllowed } = useCreateContract();
  const [error, setError] = useState('');

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm<IAddContractProps>({
    mode: 'onChange',
    values: {
      contractName: '',
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
    setIsSuccess(false);
    setIsPending(true);
    setError('');
    if (!data.namespace) {
      setError('there was an issue creating the namespace');

      return;
    }

    const tx = await submitContract(data);

    setIsPending(false);

    if (tx) {
      const createdAsset = await addAsset({
        contractName: data.contractName,
        namespace: data.namespace,
      });

      setIsSuccess(true);
      setStep(STEPS.DONE);

      handleDone?.();

      if (createdAsset) {
        setAsset(createdAsset);
      }
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

      {isSuccess && (
        <Stack width="100%" marginBlockEnd="md">
          <Notification intent="info" role="alert">
            <NotificationHeading>
              Asset created successfully
            </NotificationHeading>
            You can now use this contract.
          </Notification>
        </Stack>
      )}

      {step === STEPS.START && (
        <Stack flexDirection="column" gap="sm" width="100%">
          <AddExistingAssetForm handleDone={handleDone} />
          <Stack width="100%" justifyContent="center" marginBlock={'sm'}>
            <Divider
              label="or"
              bgColor={token('color.background.layer.default')}
            />
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
        <>
          <Button
            onPress={async () => {
              if (handleDone) handleDone();
            }}
          >
            DONE
          </Button>
        </>
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
                aria-label="Back"
                onPress={() => setStep(STEPS.START)}
                variant="transparent"
                startVisual={<MonoKeyboardArrowLeft />}
              >
                Back
              </Button>
              <Button
                aria-label="Create contract"
                isLoading={isPending}
                isDisabled={!isValid || !isAllowed}
                type="submit"
                onClick={() => {}}
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
