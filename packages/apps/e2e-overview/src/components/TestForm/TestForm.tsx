import { useEditAppTestVersion } from '@/hooks/editAppTestVersion';
import type { AppTest, InsertAppTest } from '@/hooks/getAllAppTests';
import { useAppTest } from '@/hooks/getAppTest';
import { Button, Text, TextareaField } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  appId: string;
  testId: string;
  onSuccess?: (data: AppTest) => void;
}

export const TestForm: FC<IProps> = ({ appId, testId, onSuccess }) => {
  const {
    mutate,
    isPending,
    isSuccess,
    data: updatedData,
  } = useEditAppTestVersion(appId, testId);
  const { data, isLoading } = useAppTest(appId, testId);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<InsertAppTest>({
    values: {
      app_id: appId !== 'new' ? appId : undefined,
      script: data?.script || '',
      version: data?.version || 1,
    },
  });

  const onSubmit = async (updateData: InsertAppTest) => {
    await mutate(updateData);
  };

  useEffect(() => {
    if (!isSuccess || !onSuccess) return;
    onSuccess(updatedData);
  }, [isSuccess]);

  if (isLoading) return '...loading';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {data && (
        <Text as="p">
          version: <code>{data.version}</code>
        </Text>
      )}
      <Controller
        name="script"
        control={control}
        rules={{
          required: {
            value: true,
            message: 'This field is required',
          },
        }}
        render={({ field }) => (
          <TextareaField
            id="script"
            isInvalid={!!errors.script?.message}
            errorMessage={`${errors.script?.message}`}
            label="Tests"
            {...field}
          />
        )}
      />

      <Button type="submit" isDisabled={!isValid} isLoading={isPending}>
        Edit
      </Button>
    </form>
  );
};
