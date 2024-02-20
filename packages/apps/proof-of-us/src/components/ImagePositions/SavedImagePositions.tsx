import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import Image from 'next/image';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  imageWrapper,
  signeeClass,
  signeeClassWrapper,
  signeeInputClass,
  wrapperClass,
} from './style.css';

interface IProps {
  data: IProofOfUsTokenMeta;
}

export const SavedImagePositions: FC<IProps> = ({ data }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    if (!wrapperRef.current || !imgRef.current) return;
    const wrapper = wrapperRef.current;
    const img = imgRef.current;

    const elms = wrapper.querySelectorAll('div');

    elms.forEach((elm, idx) => {
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

      const [xPos, yPos] = getPosition<HTMLDivElement>(elm, img, {
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
  }, [wrapperRef, imgRef, data.properties?.signees]);

  return (
    <>
      <section ref={wrapperRef} className={imageWrapper}>
        <img src={data.image} sizes="100vw" alt="image for our connect" />

        {/*         
        {data?.properties?.signees.map((s, idx) => (
          <span key={s.name}>
            <div
              className={signeeClassWrapper}
              data-xpercentage={s.position?.xPercentage}
              data-ypercentage={s.position?.yPercentage}
            >
              <button className={signeeClass}>{idx}</button>
            </div>
          </span>
        ))} */}
      </section>
    </>
  );
};
