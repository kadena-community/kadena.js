import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { Stack, TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface IProps {
  control: Control<IOrganisation, any>;
  errors: FieldErrors<IOrganisation>;
}

export const OrganisationFormFields: FC<IProps> = ({ control, errors }) => {
  return (
    <Stack width="100%" gap="md" flexDirection="column">
      <Controller
        name="name"
        control={control}
        rules={{
          required: {
            value: true,
            message: 'This field is required',
          },
          maxLength: {
            value: 40,
            message: 'This exceeds the maximum length',
          },
          pattern: {
            value: /^[a-zA-Z0-9_-]+$/,
            message: 'Only use allowed characters (a-z A-Z 0-9)',
          },
        }}
        render={({ field }) => (
          <TextField
            id="Name"
            isInvalid={!!errors.name?.message}
            errorMessage={`${errors.name?.message}`}
            label="Alias"
            {...field}
          />
        )}
      />

      <Controller
        name="sendEmail"
        control={control}
        rules={{
          required: {
            value: true,
            message: 'This field is required',
          },
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email regex
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            id="sendEmail"
            isInvalid={!!errors.sendEmail?.message}
            errorMessage={`${errors.sendEmail?.message}`}
            label="Send Email"
            {...field}
          />
        )}
      />
    </Stack>
  );
};
