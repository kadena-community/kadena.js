import { LOCALSTORAGE_ASSETS_KEY } from '@/constants';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { MonoAdd, MonoEditNote, MonoRemove } from '@kadena/kode-icons';
import type { PressEvent } from '@kadena/kode-ui';
import { Button, TextField } from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { ChangeEventHandler, FC } from 'react';
import { useRef, useState } from 'react';
import type { IAsset } from '../AssetProvider/AssetProvider';

interface IProps {
  asset?: IAsset;
}

export const AssetForm: FC<IProps> = ({ asset }) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { addNotification } = useNotifications();
  const [value, setValue] = useState(asset?.name ?? '');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.currentTarget.value);
  };

  const handleRemove = (data: IAsset) => {
    const key = getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY);
    const assets = JSON.parse(localStorage.getItem(key) ?? '[]').filter(
      (a: IAsset) => a.uuid !== data.uuid,
    );
    localStorage.setItem(key, JSON.stringify(assets));
    window.dispatchEvent(new Event(key));

    addNotification({
      label: 'Asset removed',
      intent: 'negative',
    });
  };

  const handleSave = (e: PressEvent) => {
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
    <TextField
      ref={ref}
      value={value}
      label="New"
      isRequired
      onChange={handleChange}
      endAddon={
        <>
          <Button
            isDisabled={!value}
            onPress={handleSave}
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
  );
};
