import {
  defaultAccentColor,
  LayoutContext,
} from '@/modules/layout/layout.provider.tsx';
import { MonoCheck } from '@kadena/react-icons';
import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { colorOptionClass, listClass } from './styles.css.ts';

interface ICreate {
  profileName: string;
  password: string;
  accentColor: string;
}

interface IProps {
  password: string;
  create: (params: ICreate) => void;
}

export const PersonalizeProfile: FC<IProps> = ({ create, password }) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<{
    profileName: string;
  }>({ mode: 'all' });
  const { setLayoutContext } = useContext(LayoutContext);
  const colorList = ['#42CEA4', '#42BDCE', '#4269CE', '#B242CE', '#CEA742'];
  const [activeColor, setActiveColor] = useState(defaultAccentColor);

  const handleChooseColor = (color: string) => {
    setActiveColor(color);
    setLayoutContext({ accentColor: color });
  };

  return (
    <>
      <Heading variant="h4">Personalize profile</Heading>
      <Stack marginBlockStart="sm">
        <Text>
          The color will be a tool to visually differentiate your profiles when
          in use
        </Text>
      </Stack>

      <form
        onSubmit={handleSubmit((arg) =>
          create({ password, accentColor: activeColor, ...arg }),
        )}
      >
        <Stack flexDirection="column" marginBlock="md" gap="sm">
          <TextField
            id="profileName"
            type="text"
            label="Profile name"
            {...register('profileName', {
              required: { value: true, message: 'This field is required' },
            })}
            isInvalid={!isValid && !!errors.profileName}
            errorMessage={errors.profileName && errors.profileName?.message}
          />
        </Stack>
        <Stack>
          <ul className={listClass}>
            {colorList.map((color) => (
              <li
                key={color}
                style={{ background: color }}
                className={colorOptionClass}
                onClick={() => handleChooseColor(color)}
              >
                {activeColor === color && <MonoCheck />}
              </li>
            ))}
          </ul>
        </Stack>
        <Stack flexDirection="column">
          <Button type="submit" isDisabled={!isValid}>
            Continue
          </Button>
        </Stack>
      </form>
    </>
  );
};
