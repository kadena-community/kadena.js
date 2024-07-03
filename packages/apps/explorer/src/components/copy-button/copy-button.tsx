import { MonoCheck, MonoContentCopy } from '@kadena/kode-icons';
import type { FC } from 'react';
import React, { useState } from 'react';

interface IProps {
  id: string;
}

const CopyButton: FC<IProps> = ({ id }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopy = async (id: string) => {
    const element = document.getElementById(id) as HTMLElement;
    if (!element) return;
    await navigator.clipboard.writeText(element.innerText);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return isSuccess ? (
    <MonoCheck onClick={() => handleCopy(id)} />
  ) : (
    <MonoContentCopy onClick={() => handleCopy(id)} />
  );
};
export default CopyButton;
