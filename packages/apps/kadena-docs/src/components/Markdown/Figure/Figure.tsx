import { Text } from '@kadena/react-components';

import { StyledFigure } from './styles';

import Image from 'next/image';
import React, { FC, ReactNode } from 'react';

interface IProps {
  alt: string;
  src: string;
  width: number;
  height: number;
}

export const Figure: FC<IProps> = ({ alt, src, width, height }) => {
  return (
    <>
      <StyledFigure>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="100vw"
          style={{ maxWidth: width, height: 'auto' }}
        />
        <figcaption>
          <Text size="sm" as="span">
            {alt}
          </Text>
        </figcaption>
      </StyledFigure>
    </>
  );
};
