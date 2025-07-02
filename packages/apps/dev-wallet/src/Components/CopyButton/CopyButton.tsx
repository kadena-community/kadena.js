// import { MonoContentCopy } from '@kadena/kode-icons/system';
import { MonoCheck, MonoContentCopy } from '@kadena/kode-icons/system';
import { Button, IButtonProps } from '@kadena/kode-ui';
import { useState } from 'react';

export const CopyButton = ({
  data,
  label,
  variant = 'transparent',
  icon = <MonoContentCopy />,
}: {
  data: string | object;
  label?: string;
  variant?: IButtonProps['variant'];
  icon?: React.ReactElement;
}) => {
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
    <Button
      variant={variant}
      isCompact
      onPress={handleCopy}
      endVisual={isSuccess ? <MonoCheck /> : icon}
    >
      {label}
    </Button>
  );
};
