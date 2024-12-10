import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useCreatePrincipalNamespace } from '@/hooks/createPrincipalNamespace';
import { useInitContract } from '@/hooks/initContract';
import type { IAddContractProps } from '@/services/createContract';
import {
  Button,
  Notification,
  NotificationHeading,
  Stack,
  Step,
  Stepper,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { IAsset } from '../AssetProvider/AssetProvider';
import { AddExistingAssetForm } from './AddExistingAssetForm';

interface IProps {
  asset?: IAsset;
  handleDone?: () => void;
}

const STEPS = {
  CREATE_NAMESPACE: 0,
  CREATE_CONTRACT: 1,
  INIT_CONTRACT: 2,
  DONE: 3,
} as const;

export const AssetStepperForm: FC<IProps> = ({ handleDone }) => {
  const [contractData, setContractData] = useState<
    IAddContractProps | undefined
  >();
  const [step, setStep] = useState<number>(STEPS.CREATE_NAMESPACE);
  const { addAsset, setAsset } = useAsset();
  const { submit } = useCreatePrincipalNamespace();
  const { submit: submitInit } = useInitContract();
  const { submit: submitContract } = useCreateContract();
  const [namespace, setNamespace] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IAddContractProps>({
    values: {
      contractName: 'asd',
      owner:
        'k:9f6a3e6ed941c9abe2c9d12afea3fe55644282c2392fe7e9571e3822d21db229',
      complianceOwner:
        'k:9f6a3e6ed941c9abe2c9d12afea3fe55644282c2392fe7e9571e3822d21db229',
      namespace,
    },
  });

  const handleSave = async (data: IAddContractProps) => {
    setContractData(data);
    const tx = await submitContract(data);
    if (tx?.result?.status === 'success') {
      setStep(STEPS.INIT_CONTRACT);
    }
  };

  return (
    <Stack width="100%" flexDirection="column" alignItems="center">
      <Stepper direction="horizontal">
        <Step
          status={step >= STEPS.CREATE_NAMESPACE ? 'active' : 'inactive'}
          active={step === STEPS.CREATE_NAMESPACE}
        >
          Namespace
        </Step>
        <Step
          status={step >= STEPS.CREATE_CONTRACT ? 'active' : 'inactive'}
          active={step === STEPS.CREATE_CONTRACT}
        >
          Contract
        </Step>
        <Step
          status={step >= STEPS.INIT_CONTRACT ? 'active' : 'inactive'}
          active={step === STEPS.INIT_CONTRACT}
        >
          Init
        </Step>
      </Stepper>

      {error && (
        <Notification role="alert">
          <NotificationHeading>There was an issue</NotificationHeading>
          {error}
        </Notification>
      )}

      {step === STEPS.CREATE_NAMESPACE && (
        <Stack flexDirection="column" gap="sm">
          <AddExistingAssetForm />
          <Stack width="100%" justifyContent="center">
            <Text bold>or</Text>
          </Stack>
          <Button
            variant="outlined"
            onPress={async () => {
              setError('');
              const transaction = await submit();
              if (transaction?.result?.status === 'success') {
                const ns = (transaction.result.data as string).split('.')[0];
                if (!ns) {
                  setError(
                    `no namespace created from result (${transaction.result.data})`,
                  );
                }
                setNamespace(ns);
                setStep(STEPS.CREATE_CONTRACT);
              } else {
                setError(`no namespace created`);
              }
            }}
          >
            Start New Asset
          </Button>
        </Stack>
      )}
      {step === STEPS.INIT_CONTRACT && (
        <Button
          onPress={async () => {
            setError('');
            const transaction = await submitInit(contractData);

            if (transaction?.result?.status === 'success' && contractData) {
              setStep(STEPS.DONE);
              const asset = addAsset({
                contractName: contractData.contractName,
                namespace: contractData.namespace,
              });
              if (!asset) return;
              setAsset(asset);
              if (handleDone) handleDone();
            } else {
              setError(`init failed`);
            }
          }}
        >
          Init Contract
        </Button>
      )}

      {step === STEPS.CREATE_CONTRACT && (
        <form onSubmit={handleSubmit(handleSave)}>
          <Controller
            name="namespace"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextField isDisabled {...field} />}
          />

          <Controller
            name="contractName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField label="Contract Name" {...field} />
            )}
          />

          <Controller
            name="owner"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextField label="Owner" {...field} />}
          />

          <Controller
            name="complianceOwner"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField label="Compliance Owner" {...field} />
            )}
          />
          <Stack>
            <Button isDisabled={!isValid} type="submit">
              Create the contract
            </Button>
          </Stack>
        </form>
      )}
    </Stack>
  );
};
