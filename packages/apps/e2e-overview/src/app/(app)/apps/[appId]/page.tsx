'use client';

import { AllAppTestVersions } from '@/components/AllAppTestVersions/AllAppTestVersions';
import { useEditApp } from '@/hooks/editApp';
import type { UpdateApp } from '@/hooks/getAllApps';
import { useApp } from '@/hooks/getApp';
import { Button, Checkbox, Heading, TextField } from '@kadena/kode-ui';
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
      is_active: data?.is_active || false,
      is_on_dashboard: data?.is_on_dashboard || false,
      name: data?.name || '',
    },
  });

  const onSubmit = async (updateData: UpdateApp) => {
    await mutate(updateData, {
      onSuccess: (data) => {
        if (innerAppId) return;
        router.push(`/apps/${data.id}`);
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="is_active"
              isInvalid={!!errors.is_active?.message}
              {...field}
              value="true"
              isSelected={field.value}
            >
              Is active
            </Checkbox>
          )}
        />
        <Controller
          name="is_on_dashboard"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="is_on_dashboard"
              isInvalid={!!errors.is_on_dashboard?.message}
              {...field}
              value="true"
              isSelected={field.value}
            >
              Show on dashboard
            </Checkbox>
          )}
        />
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
