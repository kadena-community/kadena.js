import { LOCALSTORAGE_ASSETS_KEY } from '@/constants';
import { useAsset } from '@/hooks/asset';
import { useCreatePrincipalNamespace } from '@/hooks/createPrincipalNamespace';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { MonoAdd, MonoEditNote, MonoRemove } from '@kadena/kode-icons';
import { Button, Step, Stepper, TextField } from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { useRef, useState } from 'react';
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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.currentTarget.value);
  };

  const handleRemove = (data: IAsset) => {
    removeAsset(data.uuid);

    addNotification({
      label: 'Asset removed',
      intent: 'negative',
    });
  };

  const handleSave: FormEventHandler<HTMLFormElement> = () => {
    const key = getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY);
    const assets = JSON.parse(localStorage.getItem(key) ?? '[]');

    let newAssets = [...assets];
    if (!asset) {
      const newAsset = {
        uuid: crypto.randomUUID(),
        name: value,
      };
      newAssets.push(newAsset);

      addNotification({
        label: 'Asset added',
        intent: 'positive',
      });
    } else {
      newAssets = newAssets.map((v) => {
        if (v.uuid === asset.uuid) {
          return { ...v, name: value };
        }
        return v;
      });

      addNotification({
        label: 'Asset Changed',
        intent: 'positive',
      });
    }

    setValue('');
    localStorage.setItem(key, JSON.stringify(newAssets));
    window.dispatchEvent(new Event(key));
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

      {step === STEPS.CREATE_NAMESPACE && (
        <Button
          onPress={async () => {
            const transaction = await submit();
            if (transaction?.result?.status === 'success') {
              setStep(STEPS.CREATE_CONTRACT);
            }
          }}
        >
          Create Namespace
        </Button>
      )}

      {step === STEPS.CREATE_CONTRACT && (
        <form onSubmit={handleSave}>
          <TextField
            ref={ref}
            value={value}
            label="New"
            isRequired
            onChange={handleChange}
            endAddon={
              <>
                <Button
                  type="submit"
                  isDisabled={!value}
                  endVisual={!asset ? <MonoAdd /> : <MonoEditNote />}
                />
                {asset?.uuid && (
                  <Button
                    onPress={() => handleRemove(asset)}
                    endVisual={<MonoRemove />}
                  />
                )}
              </>
            }
          />
        </form>
      )}
    </>
  );
};
