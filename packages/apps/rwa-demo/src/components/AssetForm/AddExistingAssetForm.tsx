import { useAsset } from '@/hooks/asset';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IAddExistingAssetProps {
  name: string;
}

export const AddExistingAssetForm: FC = () => {
  const router = useRouter();
  const { addExistingAsset } = useAsset();
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
    const asset = addExistingAsset(data.name);
    if (!asset) return;

    router.refresh();
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
