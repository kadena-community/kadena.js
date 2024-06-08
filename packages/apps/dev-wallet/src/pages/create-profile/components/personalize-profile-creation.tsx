import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

import { PROFILE_COLOR_LIST } from '@/constants/color-list';
import { LayoutContext } from '@/modules/layout/layout.provider';
import { MonoCheck } from '@kadena/react-icons/system';
import React, { useContext } from 'react';
import { colorOptionClass, listClass } from '../styles.css';

export const PersonalizeProfileCreation = () => {
  const {
    control,
    register,
    getValues,
    formState: { isValid, errors },
  } = useFormContext();
  const { setLayoutContext } = useContext(LayoutContext);

  return (
    <>
      <Heading variant="h4">Personalize profile</Heading>
      <Stack marginBlockStart="sm">
        <Text>
          The color will be a tool to visually differentiate your profiles when
          in use
        </Text>
      </Stack>
      <Stack flexDirection="column" marginBlock="md" gap="sm">
        <TextField
          id="profileName"
          type="text"
          label="Profile name"
          defaultValue={getValues('profileName')}
          key="profileName"
          {...register('profileName', {
            required: {
              value: true,
              message: 'This field is required',
            },
          })}
          isInvalid={!isValid && !!errors.profileName}
          errorMessage={
            errors.profileName &&
            (errors.profileName?.message as React.ReactNode)
          }
        />
      </Stack>
      <Stack>
        <Controller
          control={control}
          defaultValue={getValues('accentColor')}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <ul className={listClass}>
              {PROFILE_COLOR_LIST.map((color) => (
                <li
                  key={color}
                  style={{ background: color }}
                  className={colorOptionClass}
                  onClick={() => {
                    setLayoutContext({ accentColor: color });
                    onChange(color);
                  }}
                >
                  {value === color && <MonoCheck />}
                </li>
              ))}
            </ul>
          )}
          name="accentColor"
        />
      </Stack>
      <Stack flexDirection="column">
        <Button type="submit" isDisabled={!isValid}>
          Continue
        </Button>
      </Stack>
    </>
  );
};
