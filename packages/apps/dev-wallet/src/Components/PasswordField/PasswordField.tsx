import { Stack, TextField } from '@kadena/kode-ui';
import { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface IProps {
  value: string;
  confirmationValue: string;
  isValid: boolean;
  errors: FieldErrors<{ password: string; confirmation: string }>;
  register: UseFormRegister<any>;
}

export const PasswordField: FC<IProps> = ({
  value,
  confirmationValue,
  register,
  isValid,
  errors,
}) => {
  return (
    <Stack flexDirection="column" marginBlock="md" gap="sm">
      <TextField
        id="password"
        type="password"
        label="Password"
        autoFocus
        defaultValue={value}
        // react-hook-form uses uncontrolled elements;
        // and because we add and remove the fields we need to add key to prevent confusion for react
        key="password"
        {...register('password', {
          validate: (val: string) => {
            if (!val.length) return 'This field is required';
            if (!/^\S*$/.test(val)) return 'You are not allowed to use spaces';
            if (val.length < 6) return 'Minimum 6 symbols';
            if (!/[A-Z]/.test(val))
              return 'You need at least 1 uppercase character';
            if (!/[^A-Za-z0-9]/.test(val))
              return 'You need at least 1 special character';
            return true;
          },
        })}
        isInvalid={!isValid && !!errors.password}
        errorMessage={errors.password?.message}
      />
      <TextField
        id="confirmation"
        type="password"
        label="Confirm password"
        defaultValue={confirmationValue}
        key="confirmation"
        {...register('confirmation', {
          validate: (v: string) => {
            return value === v || 'Passwords do not match';
          },
        })}
        isInvalid={!isValid && !!errors.confirmation}
        errorMessage={errors.confirmation?.message}
      />
    </Stack>
  );
};
