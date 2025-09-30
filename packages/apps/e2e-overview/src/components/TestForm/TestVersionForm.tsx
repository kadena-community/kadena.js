import { useEditAppTestVersion } from '@/hooks/editAppTestVersion';
import type {
  AppTestVersion,
  InsertAppTestVersion,
} from '@/hooks/getAllAppTestVersions';

import { useAppTest } from '@/hooks/getAppTest';
import { Button, Text, TextareaField } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  appId: string;
  testId: string;
  onSuccess?: (data: AppTestVersion) => void;
}

export const TestVersionForm: FC<IProps> = ({ appId, testId, onSuccess }) => {
  const innerTestId = testId === 'new' ? undefined : testId;
  const {
    mutate,
    isPending,
    isSuccess,
    data: updatedData,
  } = useEditAppTestVersion(appId, innerTestId);
  const { data, isLoading } = useAppTest(appId, innerTestId);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<InsertAppTestVersion>({
    values: {
      id: innerTestId,
      app_id: appId,
      script: data?.script || '',
      version: data?.version || 1,
    },
  });

  const onSubmit = async (updateData: InsertAppTestVersion) => {
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
