import { Wrapper } from './styles';

import { OpenAPIV3 } from 'openapi-types';
import React, { FC, useEffect, useState } from 'react';
import { RedocStandalone } from 'redoc';

interface IProps {
  specs: OpenAPIV3.Document;
}

export const Specs: FC<IProps> = ({ specs }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  if (!isMounted) {
    return <pre>{JSON.stringify(specs, null, 2)}</pre>;
  }
  return (
    <>
      <Wrapper>
        <RedocStandalone
          spec={specs}
          options={{
            pathInMiddlePanel: true,
            theme: {
              colors: {
                primary: {
                  main: 'RGB(218,52,140)', // Kadena pink
                },
              },
            },
            expandResponses: '200,201,204',
          }}
        />
      </Wrapper>
    </>
  );
};
