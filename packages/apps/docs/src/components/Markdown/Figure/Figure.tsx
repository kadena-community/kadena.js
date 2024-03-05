import { Dialog, Text } from '@kadena/react-ui';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { FC } from 'react';
import React, { useState } from 'react';
import {
  figCaption,
  figure,
  figureImg,
  imageModalAltTextClass,
  imageModalClass,
} from './styles.css';

interface IProps {
  alt: string;
  src: string;
}

const spring = {
  type: 'spring',
  damping: 9,
  stiffness: 120,
};

export const Figure: FC<IProps> = ({ alt, src }) => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setDimension({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };

  const handleOpenModal: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <AnimatePresence>
      <Dialog
        className={imageModalClass}
        isOpen={isModalOpen}
        isDismissable={false}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <motion.img
          layoutId={src}
          initial={{ ...spring, scale: 0.5 }}
          animate={{ ...spring, scale: 1 }}
          exit={{ ...spring, scale: 1 }}
          transition={{ duration: 0.5 }}
          key={src}
          className={figureImg}
          src={src}
          alt={alt}
          width={dimension.width}
          height={dimension.height}
          onLoad={handleLoad}
        />
        {alt ? (
          <Text className={imageModalAltTextClass} variant="smallest" as="span">
            {alt}
          </Text>
        ) : (
          <></>
        )}
      </Dialog>

      <figure className={figure} onClick={handleOpenModal}>
        <motion.div layoutId={src}>
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
        </motion.div>

        {alt ? (
          <figcaption className={figCaption}>
            <Text variant="smallest" as="span">
              {alt}
            </Text>
          </figcaption>
        ) : (
          <></>
        )}
      </figure>
    </AnimatePresence>
  );
};
