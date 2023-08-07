import { specsWrapper } from './styles.css';

import { OpenAPIV3 } from 'openapi-types';
import React, { FC, useEffect, useState } from 'react';
import { RedocRawOptions, RedocStandalone } from 'redoc';

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
