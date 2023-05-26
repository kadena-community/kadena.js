import { Text } from '@kadena/react-components';

import { StyledFigure } from './styles';

import Image from 'next/image';
import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  alt: string;
  src: string;
}

export const Figure: FC<IProps> = ({ children, alt, src }) => {
  return (
    <StyledFigure>
      {children}
      <Image
        src={src}
        alt={alt}
        width="0"
        height="0"
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />
      <figcaption>
        <Text size="sm" as="span">
          {alt}
        </Text>
      </figcaption>
    </StyledFigure>
  );
};
