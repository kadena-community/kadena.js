import { Badge, Select, SelectItem, Stack, TextField } from '@kadena/kode-ui';
import { Label } from './Label';

export type Seconds = number & { _brand?: 'Seconds' };

export function TTLSelect({
  value,
  onChange,
}: {
  value: Seconds;
  onChange: (ttl: Seconds) => void;
}) {
  return (
    <Stack gap={'sm'} alignItems={'center'}>
      <Stack flex={1}>
        <Select
          size="sm"
          startVisual={<Label>Expiration:</Label>}
          selectedKey={getTTlKey(value)}
          onSelectionChange={(key) => {
            const newTTL = getTTlValue(key as any);
            onChange(newTTL);
          }}
        >
          <SelectItem key="30min">30 min</SelectItem>
          <SelectItem key="2hours">2 hours</SelectItem>
          <SelectItem key="6hours">6 hours</SelectItem>
          <SelectItem key="1day">1 day</SelectItem>
          <SelectItem key="2days">2 days</SelectItem>
          <SelectItem key="custom">custom</SelectItem>
        </Select>
      </Stack>
      <Stack>
        <TextField
          aria-label="TTL"
          endAddon={
            <Stack paddingInlineEnd={'sm'}>
              <Badge size="sm">Seconds</Badge>
            </Stack>
          }
          placeholder="Enter TTL (Timer to live)"
          value={value.toString()}
          defaultValue={value.toString()}
          onChange={(e) => {
            onChange(+e.target.value);
          }}
          type="number"
          size="sm"
        />
      </Stack>
    </Stack>
  );
}

type TTLOptions = '30min' | '2hours' | '6hours' | '1day' | '2days' | 'custom';

function getTTlKey(ttl: Seconds): TTLOptions {
  if (ttl === 30 * 60) {
    return '30min';
  }
  if (ttl === 2 * 60 * 60) {
    return '2hours';
  }
  if (ttl === 6 * 60 * 60) {
    return '6hours';
  }
  if (ttl === 24 * 60 * 60) {
    return '1day';
  }
  if (ttl === 48 * 60 * 60) {
    return '2days';
  }
  return 'custom';
}

function getTTlValue(key: TTLOptions): Seconds {
  switch (key) {
    case '30min':
      return 30 * 60;
    case '2hours':
      return 2 * 60 * 60;
    case '6hours':
      return 6 * 60 * 60;
    case '1day':
      return 24 * 60 * 60;
    case '2days':
      return 48 * 60 * 60;
    default:
      return 0;
  }
}
