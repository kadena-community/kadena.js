// import { MonoContentCopy } from '@kadena/kode-icons/system';
import { MonoContentCopy } from '@kadena/kode-icons/system';
import { Button } from '@kadena/kode-ui';

export const CopyButton = ({ data }: { data: string | object }) => (
  <Button
    variant="transparent"
    isCompact
    onClick={() =>
      navigator.clipboard.writeText(
        typeof data === 'string' ? data : JSON.stringify(data, null, 2),
      )
    }
  >
    <MonoContentCopy />
  </Button>
);
