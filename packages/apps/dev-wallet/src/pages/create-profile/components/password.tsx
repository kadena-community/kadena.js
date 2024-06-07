import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const Password = ({ isShortFlow }: { isShortFlow: boolean }) => {
  const {
    register,
    getValues,
    formState: { isValid, errors },
  } = useFormContext();
  const navigate = useNavigate();

  return (
    <>
      <Heading variant="h4">Choose a password</Heading>
      <Stack marginBlockStart="sm">
        <Text>
          Carefully select your password as this will be your main security of
          your wallet
        </Text>
      </Stack>
      <Stack flexDirection="column" marginBlock="md" gap="sm">
        <TextField
          id="password"
          type="password"
          label="Password"
          defaultValue={getValues('password')}
          // react-hook-form uses uncontrolled elements;
          // and because we add and remove the fields we need to add key to prevent confusion for react
          key="password"
          {...register('password', {
            required: {
              value: true,
              message: 'This field is required',
            },
            minLength: { value: 6, message: 'Minimum 6 symbols' },
          })}
          isInvalid={!isValid && !!errors.password}
          errorMessage={errors.password?.message as any}
        />
        <TextField
          id="confirmation"
          type="password"
          label="Confirm password"
          defaultValue={getValues('confirmation')}
          key="confirmation"
          {...register('confirmation', {
            validate: (value) => {
              return (
                getValues('password') === value || 'Passwords do not match'
              );
            },
          })}
          isInvalid={!isValid && !!errors.confirmation}
          errorMessage={errors.confirmation?.message as any}
        />
      </Stack>
      <Stack flexDirection="column">
        {isShortFlow && (
          <Button type="submit" isDisabled={!isValid}>
            Continue
          </Button>
        )}
        {!isShortFlow && (
          <Button
            type="button"
            onClick={() => navigate('personalize-profile')}
            isDisabled={Boolean(
              errors.confirmation?.message ||
                errors.password?.message ||
                !getValues('password') ||
                !getValues('confirmation'),
            )}
          >
            Continue
          </Button>
        )}
      </Stack>
    </>
  );
};
