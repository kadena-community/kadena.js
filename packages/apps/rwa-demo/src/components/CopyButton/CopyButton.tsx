import { MonoCheck, MonoCopyAll } from '@kadena/kode-icons';
import type { PressEvent } from '@kadena/kode-ui';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useState } from 'react';

interface IProps {
  value: string;
}

export const CopyButton: FC<IProps> = ({ value }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = (e: PressEvent) => {
    setIsPressed(true);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(value);

    setTimeout(() => {
      setIsPressed(false);
    }, 3000);
  };

  return (
    <Button
      data-testid="copyAsset"
      onPress={handlePress}
      isCompact
      variant="transparent"
      startVisual={isPressed ? <MonoCheck /> : <MonoCopyAll />}
    />
  );
};
