import { toISOLocalDateTime } from '@/utils/helpers';
import { Badge, Stack, TextField } from '@kadena/kode-ui';
import { useEffect, useState } from 'react';
import { Label } from './Label';
import { Seconds } from './TTLSelect';
import { hideInMobileClass } from './style.css';

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
  const timeZone =
    Intl?.DateTimeFormat?.()?.resolvedOptions?.().timeZone || undefined;

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
      endAddon={
        timeZone ? (
          <Stack paddingInlineEnd={'sm'} className={hideInMobileClass}>
            <Badge size="sm">{timeZone}</Badge>
          </Stack>
        ) : undefined
      }
      onChange={(e) => {
        onChange(Math.round(new Date(e.target.value).getTime() / 1000));
      }}
      type="datetime-local"
      size="sm"
    />
  );
}
