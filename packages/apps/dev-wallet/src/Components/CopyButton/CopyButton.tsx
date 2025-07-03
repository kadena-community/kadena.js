// import { MonoContentCopy } from '@kadena/kode-icons/system';
import { MonoCheck, MonoContentCopy } from '@kadena/kode-icons/system';
import { Button, IButtonProps, ITooltipProps, Tooltip } from '@kadena/kode-ui';
import { FC, useState } from 'react';

interface ICopyButtonProps {
  data: string | object;
  label?: string;
  variant?: IButtonProps['variant'];
  icon?: React.ReactElement;
  tooltip?: Omit<ITooltipProps, 'children'>;
}

export const CopyButton: FC<ICopyButtonProps> = ({
  data,
  label,
  variant = 'transparent',
  icon = <MonoContentCopy />,
  tooltip,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    );

    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  const render = () => {
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

  if (tooltip) {
    return (
      <Tooltip {...tooltip} isOpen={isSuccess}>
        {render()}
      </Tooltip>
    );
  }

  return render();
};
