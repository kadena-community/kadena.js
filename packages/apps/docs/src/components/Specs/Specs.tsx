import type { OpenAPIV3 } from 'openapi-types';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { RedocRawOptions } from 'redoc';
import { RedocStandalone } from 'redoc';
import { specsWrapper } from './styles.css';

interface IProps {
  specs: OpenAPIV3.Document;
  options: RedocRawOptions;
}

export const Specs: FC<IProps> = ({ specs, options }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  if (!isMounted) {
    return <pre>{JSON.stringify(specs, null, 2)}</pre>;
  }
  return (
    <div className={specsWrapper}>
      <RedocStandalone spec={specs} options={options} />
    </div>
  );
};
