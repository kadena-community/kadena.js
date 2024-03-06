import { Text } from '@kadena/react-ui';
import Image from 'next/image';
import type { FC } from 'react';
import React, { useState } from 'react';
import { figCaption, figure, figureImg } from './styles.css';
import { useFigureModal } from './useFigure';

interface IProps {
  alt: string;
  src: string;
}

export const Figure: FC<IProps> = ({ alt, src }) => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const { toggleModal } = useFigureModal();

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setDimension({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };

  const handleOpenModal: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    toggleModal(src, alt);
  };

  return (
    <>
      <figure className={figure} onClick={handleOpenModal}>
        <Image
          className={figureImg}
          src={src}
          alt={alt}
          width={dimension.width}
          height={dimension.height}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/assets/blur.jpg"
          onLoad={handleLoad}
        />

        {alt ? (
          <figcaption>
            <Text variant="smallest" as="span" className={figCaption}>
              {alt}
            </Text>
          </figcaption>
        ) : null}
      </figure>
    </>
  );
};
