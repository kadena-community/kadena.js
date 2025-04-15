// import { MonoContentCopy } from '@kadena/kode-icons/system';
import { MonoCheck, MonoContentCopy } from '@kadena/kode-icons/system';
import { Button } from '@kadena/kode-ui';
import { useState } from 'react';

export const CopyButton = ({ data }: { data: string | object }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    );

    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <Button variant="transparent" isCompact onPress={handleCopy}>
      {isSuccess ? <MonoCheck /> : <MonoContentCopy />}
    </Button>
  );
};
