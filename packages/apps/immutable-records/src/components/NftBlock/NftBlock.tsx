'use client';
import Image from 'next/image';
import type { FC } from 'react';
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { ModalContent } from '../ModalContent/ModalContent';
import {
  mainRowItem,
  mainRowItemActive,
  mainRowItemActiveDot,
  mainRowItemBlock,
  mainRowItemInnerBlock,
  mainRowItemUnavailable,
  modalImage,
  progressBar,
  progressVar,
} from './NftBlock.css';

interface NftBlockProps {
  day: number;
  available: boolean;
  active: boolean;
  progress?: number;
}

export const NftBlock: FC<NftBlockProps> = ({
  day,
  available,
  active,
  progress,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div key={day} className={mainRowItem}>
        {active ? (
          <div className={mainRowItemActive} onClick={() => setModalOpen(true)}>
            <div
              className={progressBar}
              // @ts-ignore updating css var works fine
              style={{
                [progressVar.substring(4, progressVar.length - 1)]: `${
                  progress ?? 0
                }`,
              }}
            />
            <div className={mainRowItemActiveDot}></div>
          </div>
        ) : available ? (
          <div className={mainRowItemBlock} onClick={() => setModalOpen(true)}>
            <div className={mainRowItemInnerBlock}>
              <Image
                src={`https://picsum.photos/200/200`}
                alt="NFT preview"
                width={100}
                height={100}
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <div className={mainRowItemUnavailable}>+</div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent
          tabs={[
            {
              label: 'Overview',
              content: (
                <Image
                  className={modalImage}
                  src={`https://picsum.photos/600/600`}
                  alt="NFT"
                  width={600}
                  height={600}
                />
              ),
              sidebar: <div>sidebar</div>,
            },
          ]}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </>
  );
};
