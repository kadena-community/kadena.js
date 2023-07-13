import { Text } from '@kadena/react-ui';

import { StyledFigure } from './styles';

import Image from 'next/image';
import React, { FC, useState } from 'react';

interface IProps {
  alt: string;
  src: string;
}

export const Figure: FC<IProps> = ({ alt, src }) => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setDimension({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };
  return (
    <StyledFigure>
      <Image
        src={src}
        alt={alt}
        width={dimension.width}
        height={dimension.height}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="/assets/blur.jpg"
        onLoad={handleLoad}
      />
      <figcaption>
        <Text size="sm" as="span">
          {alt}
        </Text>
      </figcaption>
    </StyledFigure>
  );
};
