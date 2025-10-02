import type { UpdateApp } from '@/hooks/getAllApps';
import { Heading, Stack, Text, TextField } from '@kadena/kode-ui';
import cronstrue from 'cronstrue';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

interface IProps {
  setValue: UseFormSetValue<UpdateApp>;
  value?: string;
}

export const AppCronSettings: FC<IProps> = ({ setValue, value }) => {
  const [humanReadableString, setHumanReadableString] = useState('');
  const values = value?.split(' ') ?? [];
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const dayOfMonthRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayOfWeekRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    const minute = minuteRef.current?.value || '*';
    const hour = hourRef.current?.value || '*';
    const dayOfMonth = dayOfMonthRef.current?.value || '*';
    const month = monthRef.current?.value || '*';
    const dayOfWeek = dayOfWeekRef.current?.value || '*';

    const value = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    const parsed = cronstrue.toString(value, {
      verbose: true, // Optional: Makes the output more detailed
      throwExceptionOnParseError: true,
    });
    setHumanReadableString(parsed);
    setValue('cron', value);
  };

  useEffect(() => {
    const parsed = cronstrue.toString(value ?? '', {
      verbose: true, // Optional: Makes the output more detailed
      throwExceptionOnParseError: true,
    });
    setHumanReadableString(parsed);
  }, [value]);

  return (
    <Stack flexDirection="column">
      <Heading as="h4">Cron Settings</Heading>
      <Stack>
        <TextField
          id="minute"
          defaultValue={values.at(0)}
          ref={minuteRef}
          onBlur={() => {
            handleChange();
          }}
        />
        <TextField
          id="hour"
          defaultValue={values.at(1)}
          ref={hourRef}
          onBlur={() => {
            handleChange();
          }}
        />
        <TextField
          id="day_of_month"
          defaultValue={values.at(2)}
          ref={dayOfMonthRef}
          onBlur={() => {
            handleChange();
          }}
        />
        <TextField
          id="month"
          defaultValue={values.at(3)}
          ref={monthRef}
          onBlur={() => {
            handleChange();
          }}
        />
        <TextField
          id="day_of_week"
          defaultValue={values.at(4)}
          ref={dayOfWeekRef}
          onBlur={() => {
            handleChange();
          }}
        />
      </Stack>

      <Stack>
        <Text>{humanReadableString}</Text>
      </Stack>
    </Stack>
  );
};
