'use client';

import { AllAppTestVersions } from '@/components/AllAppTestVersions/AllAppTestVersions';
import { useEditApp } from '@/hooks/editApp';
import type { UpdateApp } from '@/hooks/getAllApps';
import { useApp } from '@/hooks/getApp';
import { Button, Heading, TextField } from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Controller, useForm } from 'react-hook-form';

const Home = ({ params }: { params: Promise<{ appId: string }> }) => {
  const { appId } = use(params);
  const innerAppId = appId === 'new' ? undefined : appId;
  const { data } = useApp(innerAppId);
  const { mutate, isPending } = useEditApp();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<UpdateApp>({
    values: {
      id: innerAppId,
      name: data?.name || '',
    },
  });

  const onSubmit = async (updateData: UpdateApp) => {
    await mutate(updateData, {
      onSuccess: (data) => {
        console.log(11111111);
        if (innerAppId) return;
        router.push(`/apps/${data.id}`);
      },
    });
  };

  return (
    <>
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

      {innerAppId && (
        <>
          <Heading as="h2">Tests</Heading>
          <AllAppTestVersions appId={innerAppId} />
        </>
      )}
    </>
  );
};

export default Home;
