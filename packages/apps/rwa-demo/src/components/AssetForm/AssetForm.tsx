import { LOCALSTORAGE_ASSETS_KEY } from '@/constants';
import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { useCreatePrincipalNamespace } from '@/hooks/createPrincipalNamespace';
import type { IAddContractProps } from '@/services/createContract';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { MonoAdd, MonoEditNote, MonoRemove } from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NotificationHeading,
  Step,
  Stepper,
  TextField,
} from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { IAsset } from '../AssetProvider/AssetProvider';

interface IProps {
  asset?: IAsset;
}

const STEPS = {
  CREATE_NAMESPACE: 0,
  CREATE_CONTRACT: 1,
  INIT_CONTRACT: 2,
} as const;

export const AssetForm: FC<IProps> = ({ asset }) => {
  const [step, setStep] = useState<number>(STEPS.CREATE_NAMESPACE);
  const ref = useRef<HTMLInputElement | null>(null);
  const { removeAsset } = useAsset();
  const { addNotification } = useNotifications();
  const [value, setValue] = useState(asset?.name ?? '');
  const { submit } = useCreatePrincipalNamespace();
  const { submit: submitContract } = useCreateContract();
  const [namespace, setNamespace] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit } = useForm<IAddContractProps>({
    values: {
      name: '',
      namespace,
    },
  });

  const handleSave = async (data: IAddContractProps) => {
    console.log({ data });
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
          <TextField
            value={namespace}
            isDisabled
            {...register('namespace', { required: true })}
          />
          <TextField
            label="New"
            {...register('name', { required: true })}
            endAddon={
              <>
                <Button
                  type="submit"
                  endVisual={!asset ? <MonoAdd /> : <MonoEditNote />}
                />
              </>
            }
          />
        </form>
      )}
    </>
  );
};
