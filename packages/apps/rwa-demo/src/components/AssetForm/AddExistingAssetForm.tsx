import { useAsset } from '@/hooks/asset';
import { getActiveComplianceRules } from '@/services/getComplianceRules';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  handleDone?: () => void;
}
interface IAddExistingAssetProps {
  name: string;
}

export const AddExistingAssetForm: FC<IProps> = ({ handleDone }) => {
  const { setAsset, addExistingAsset } = useAsset();
  const { addNotification } = useNotifications();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IAddExistingAssetProps>({
    values: {
      name: '',
    },
  });

  const handleSave = async (data: IAddExistingAssetProps) => {
    const result = await getActiveComplianceRules(data.name);
    if (result === -1) {
      addNotification({
        intent: 'negative',
        label: 'Contract does not exist',
        message: `The contract does not exist on the chain: ${data.name}`,
      });
      return;
    }

    const asset = addExistingAsset(data.name);
    if (!asset) return;

    setAsset(asset);
    window.location.href = '/';

    if (handleDone) handleDone();
  };

  return (
    <Stack
      as="form"
      flexDirection="column"
      gap="sm"
      onSubmit={handleSubmit(handleSave)}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField placeholder="Asset name" {...field} />
        )}
      />

      <Button isDisabled={!isValid} type="submit">
        Add Existing Asset
      </Button>
    </Stack>
  );
};
