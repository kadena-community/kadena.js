'use client';

import type { UpdateApp } from '@/hooks/getAllApps';
import { useApp } from '@/hooks/getApp';
import { useUpdateApp } from '@/hooks/updateApp';
import { Button, Heading, TextField } from '@kadena/kode-ui';
import { use } from 'react';
import { Controller, useForm } from 'react-hook-form';

const Home = ({ params }: { params: Promise<{ appId: string }> }) => {
  const { appId } = use(params);
  const { data, isLoading } = useApp(appId);
  const { mutate, isPending, isError, error: mutationError } = useUpdateApp();

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<UpdateApp>({
    values: {
      id: appId,
      name: data?.name || '',
    },
  });

  const onSubmit = async (updateData: UpdateApp) => {
    await mutate(updateData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Heading>{data?.name}</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'This field is required',
            },
          }}
          render={({ field }) => (
            <TextField
              id="name"
              isInvalid={!!errors.name?.message}
              errorMessage={`${errors.name?.message}`}
              label="Name"
              {...field}
            />
          )}
        />

        <Button type="submit" isDisabled={!isValid} isLoading={isPending}>
          Edit
        </Button>
      </form>
    </>
  );
};

export default Home;
