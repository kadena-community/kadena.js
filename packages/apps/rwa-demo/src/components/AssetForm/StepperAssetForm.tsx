import { useCreateContract } from '@/hooks/createContract';
import { useCreatePrincipalNamespace } from '@/hooks/createPrincipalNamespace';
import type { IAddContractProps } from '@/services/createContract';
import {
  Button,
  Notification,
  NotificationHeading,
  Stack,
  Step,
  Stepper,
  TextField,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { IAsset } from '../AssetProvider/AssetProvider';

interface IProps {
  asset?: IAsset;
}

const STEPS = {
  CREATE_NAMESPACE: 0,
  CREATE_CONTRACT: 1,
  INIT_CONTRACT: 2,
} as const;

export const StepperAssetForm: FC<IProps> = () => {
  const [step, setStep] = useState<number>(STEPS.CREATE_CONTRACT);
  const { submit } = useCreatePrincipalNamespace();
  const { submit: submitContract } = useCreateContract();
  const [namespace, setNamespace] = useState(
    'n_413afb3246992ade57f52e1a6e44b5454f8b6cca',
  );
  const [error, setError] = useState('');

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IAddContractProps>({
    values: {
      contractName: '',
      owner: '',
      complianceOwner: '',
      namespace,
    },
  });

  const handleSave = async (data: IAddContractProps) => {
    console.log(22);
    await submitContract(data);
  };

  return (
    <>
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
        <Button
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
          Create Namespace
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
    </>
  );
};
