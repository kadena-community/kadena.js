import { EditorForm } from '@/EditorForm/EditorForm';
import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning, isSignedOnce } from '@/utils/isAlreadySigning';
import type { FC, MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal/Modal';
import { SigneePosition } from '../Signees/SigneePosition';
import { TagInfo } from './TagInfo';
import { imageClass, wrapperClass } from './style.css';

interface IProps {}

export const ImagePositions: FC<IProps> = () => {
  const { proofOfUs, signees, updateSignee, background } = useProofOfUs();
  const { account } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [signer, setSigner] = useState<IProofOfUsSignee>();
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isTagInfoOpen, setIsTagInfoOpen] = useState(true);

  useEffect(() => {
    if (!signees || !proofOfUs) return;

    setSigner(signees.find((c) => c.accountName === account?.accountName));
    setIsLocked(isAlreadySigning(proofOfUs));
  }, [proofOfUs, signees]);

  const getPosition = <T extends HTMLElement>(
    elm: T,
    img: HTMLImageElement,
    clickPosition: { xPercentage: number; yPercentage: number },
  ): [number, number] => {
    const rect = elm.getBoundingClientRect();
    const maxPosX = img.width - rect.width;
    const maxPosY = img.height - rect.height;
    const actualPosX = (clickPosition.xPercentage / 100) * img.width;
    const actualPosY = (clickPosition.yPercentage / 100) * img.height;
    const posX = Math.min(Math.max(0, actualPosX), maxPosX);
    const posY = Math.min(Math.max(0, actualPosY), maxPosY);

    return [posX, posY];
  };

  const setMarkers = () => {
    if (!wrapperRef.current || !imgRef.current || !isMounted) return;
    const wrapper = wrapperRef.current;
    const img = imgRef.current;

    const elms = wrapper.querySelectorAll<HTMLElement>('[data-position]');

    elms.forEach((elm) => {
      const xPercentage: number = parseFloat(
        elm.getAttribute('data-xpercentage') ?? '0',
      );
      const yPercentage: number = parseFloat(
        elm.getAttribute('data-ypercentage') ?? '0',
      );

      if (!xPercentage || !yPercentage) {
        elm.setAttribute('style', `display: none`);
        return;
      }

      const [xPos, yPos] = getPosition<HTMLElement>(elm, img, {
        xPercentage,
        yPercentage,
      });

      elm.setAttribute(
        'style',
        `display: flex; top: ${yPos}px; left: ${xPos}px;`,
      );
    });
  };

  useEffect(() => {
    setMarkers();
    window.addEventListener('resize', setMarkers);

    return () => {
      window.removeEventListener('resize', setMarkers);
    };
  }, [wrapperRef, imgRef, signees, isMounted]);

  const handleClick: MouseEventHandler<HTMLImageElement> = async (e) => {
    if (!imgRef.current || isLocked) return;
    setIsEditorOpen(true);
    setIsTagInfoOpen(false);

    // Calculate the coordinates relative to the image
    const rect = imgRef.current.getBoundingClientRect();
    const xPercentage = ((e.clientX - rect.left) / imgRef.current.width) * 100;
    const yPercentage = ((e.clientY - rect.top) / imgRef.current.height) * 100;

    console.log('update in imageposition click');
    await updateSignee({
      position: { xPercentage, yPercentage },
    });
  };

  const handleRemove = async () => {
    console.log('update in imageposition remove');
    await updateSignee({ position: null });
  };

  if (!signees) return null;

  return (
    <>
      {isEditorOpen && (
        <Modal label="Add details" onClose={() => setIsEditorOpen(false)}>
          <EditorForm signer={signer} onClose={() => setIsEditorOpen(false)} />
        </Modal>
      )}
      <section ref={wrapperRef} className={wrapperClass}>
        <img
          className={imageClass}
          ref={imgRef}
          src={background.bg}
          onClick={handleClick}
          onLoad={() => setIsMounted(true)}
        />
        {isTagInfoOpen && proofOfUs && !isSignedOnce(signees) && (
          <TagInfo handleClose={() => setIsTagInfoOpen(false)} />
        )}
        {signees.map((s, idx) => (
          <SigneePosition
            variant="small"
            key={s.accountName}
            position={s?.position}
            onClick={handleRemove}
            idx={idx}
          />
        ))}
      </section>
    </>
  );
};
