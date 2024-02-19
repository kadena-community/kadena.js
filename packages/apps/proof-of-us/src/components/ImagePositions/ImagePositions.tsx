import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  signeeClass,
  signeeClassWrapper,
  signeeInputClass,
  wrapperClass,
} from './style.css';

interface IProps {}

export const ImagePositions: FC<IProps> = () => {
  const { proofOfUs, updateSigner, background } = useProofOfUs();
  const { account } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [signer, setSigner] = useState<IProofOfUsSignee>();
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSigner(
      proofOfUs?.signees.find((c) => c.accountName === account?.accountName),
    );
    setIsLocked(isAlreadySigning(proofOfUs?.signees));
  }, [proofOfUs]);

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

    const elms = wrapper.querySelectorAll('div');
    const inputs = wrapper.querySelectorAll('input');

    elms.forEach((elm, idx) => {
      const input = inputs[idx];

      const xPercentage: number = parseFloat(
        elm.getAttribute('data-xpercentage') ?? '0',
      );
      const yPercentage: number = parseFloat(
        elm.getAttribute('data-ypercentage') ?? '0',
      );

      if (!xPercentage || !yPercentage) {
        elm.setAttribute('style', `display: none`);
        input.setAttribute('style', `display: none`);
        return;
      }

      const [xPos, yPos] = getPosition<HTMLDivElement>(elm, img, {
        xPercentage,
        yPercentage,
      });

      elm.setAttribute(
        'style',
        `display: flex; top: ${yPos}px; left: ${xPos}px;`,
      );

      //input
      const [xPosMarker, yPosMarker] = getPosition<HTMLInputElement>(
        input,
        img,
        {
          xPercentage,
          yPercentage,
        },
      );

      input.setAttribute(
        'style',
        `display: flex; top: ${yPosMarker}px; left: ${xPosMarker}px;`,
      );
    });
  };

  useEffect(() => {
    setMarkers();
    window.addEventListener('resize', setMarkers);

    return () => {
      window.removeEventListener('resize', setMarkers);
    };
  }, [wrapperRef, imgRef, proofOfUs?.signees, isMounted]);

  const handleClick: MouseEventHandler<HTMLImageElement> = (e) => {
    if (!imgRef.current || isLocked) return;

    // Calculate the coordinates relative to the image
    const rect = imgRef.current.getBoundingClientRect();
    const xPercentage = ((e.clientX - rect.left) / imgRef.current.width) * 100;
    const yPercentage = ((e.clientY - rect.top) / imgRef.current.height) * 100;

    updateSigner({ position: { xPercentage, yPercentage } });
  };

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    //TODO: this needs to debounce

    updateSigner({
      label: e.target.value,
    });
  };

  const handleRemove = () => {
    updateSigner({ position: null });
  };

  return (
    <>
      <section ref={wrapperRef} className={wrapperClass}>
        <img
          ref={imgRef}
          src={background.bg}
          onClick={handleClick}
          onLoad={() => setIsMounted(true)}
        />
        {proofOfUs?.signees.map((s, idx) => (
          <span key={s.accountName}>
            <div
              className={signeeClassWrapper}
              data-xpercentage={s.position?.xPercentage}
              data-ypercentage={s.position?.yPercentage}
            >
              <button className={signeeClass} onClick={handleRemove}>
                {idx}
              </button>
            </div>
            <input
              className={signeeInputClass}
              value={s.label}
              disabled={signer?.accountName !== s.accountName || isLocked}
              type="text"
              name="label"
              onChange={handleLabelChange}
            />
          </span>
        ))}
      </section>
    </>
  );
};
