import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { shorten } from '@/utils/helpers';
import { Heading, Stack } from '@kadena/kode-ui';
import { codeClass } from '../style.css';

export const JsonView = ({
  title,
  data,
  shortening = 0,
}: {
  title: string;
  data: any;
  shortening?: number;
}) => (
  <Stack gap={'sm'} flexDirection={'column'}>
    <Stack gap={'sm'} flexDirection={'column'}>
      <Stack justifyContent={'space-between'}>
        <Heading variant="h4">{title}</Heading>
        <CopyButton data={data} />
      </Stack>
      <pre className={codeClass}>
        {data && typeof data === 'object'
          ? JSON.stringify(data, null, 2)
          : shortening
            ? shorten(data, shortening)
            : data}
      </pre>
    </Stack>
  </Stack>
);
