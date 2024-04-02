import { Dialog, Text } from '@kadena/react-ui';
import Image from 'next/image';
import type { FC } from 'react';
import React, { useState } from 'react';
import { figCaption, figure, figureImg, imageModalClass } from './styles.css';

interface IProps {
  alt: string;
  src: string;
}

export const Figure: FC<IProps> = ({ alt, src }) => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setDimension({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };

  return (
    <>
      {isModalOpen && (
        <Dialog
          className={imageModalClass}
          isOpen
          onOpenChange={() => setIsModalOpen(false)}
        >
          <div
            onClick={() => setIsModalOpen(false)}
            style={{ display: 'flex', flex: 1, width: '100%' }}
          >
            <figure className={figure} onClick={() => setIsModalOpen(true)}>
              <img
                className={figureImg}
                src={src}
                alt={alt}
                width={dimension.width}
                height={dimension.height}
              />

              {alt ? (
                <figcaption>
                  <Text size="smallest" as="span" className={figCaption}>
                    {alt}
                  </Text>
                </figcaption>
              ) : null}
            </figure>
          </div>
        </Dialog>
      )}
      <figure className={figure} onClick={() => setIsModalOpen(true)}>
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
            <Text size="smallest" as="span" className={figCaption}>
              {alt}
            </Text>
          </figcaption>
        ) : null}
      </figure>
    </>
  );
};
