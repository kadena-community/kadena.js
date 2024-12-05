import { toISOLocalDateTime } from '@/utils/helpers';
import { TextField } from '@kadena/kode-ui';
import { useEffect, useState } from 'react';
import { Label } from './Label';
import { Seconds } from './TTLSelect';

export function CreationTime({
  value,
  onChange,
}: {
  value?: Seconds;
  onChange: (value: Seconds) => void;
}) {
  const [defaultTime, setDefaultTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setDefaultTime(Date.now());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <TextField
      aria-label="Valid From"
      startVisual={<Label>Valid From</Label>}
      placeholder="When to start the transaction"
      value={
        value
          ? toISOLocalDateTime(value * 1000)
          : toISOLocalDateTime(defaultTime)
      }
      defaultValue={toISOLocalDateTime(defaultTime)}
      onChange={(e) => {
        console.log('e.target.value', new Date(e.target.value));
        onChange(Math.round(new Date(e.target.value).getTime() / 1000));
      }}
      type="datetime-local"
      size="sm"
    />
  );
}
