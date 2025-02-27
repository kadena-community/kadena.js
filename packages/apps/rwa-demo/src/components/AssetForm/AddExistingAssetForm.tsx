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
    formState: { isValid, errors },
  } = useForm<IAddExistingAssetProps>({
    mode: 'onChange',
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
        rules={{
          required: true,
          pattern: {
            value: /^n_[a-f0-9]+\.([a-zA-Z0-9_-]+)$/,
            message:
              'The contract does not have the correct format (example n_NAMESPACE.NAME)',
          },
        }}
        render={({ field }) => (
          <TextField
            placeholder="Asset name"
            {...field}
            isInvalid={!!errors.name?.message}
            errorMessage={`${errors.name?.message}`}
          />
        )}
      />

      <Button isDisabled={!isValid} type="submit">
        Add Existing Asset
      </Button>
    </Stack>
  );
};
