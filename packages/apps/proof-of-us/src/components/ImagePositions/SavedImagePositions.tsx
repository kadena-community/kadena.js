import { getIPFSLink } from '@/utils/getIPFSLink';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { SigneePosition } from '../Signees/SigneePosition';
import { gradientClass, imageWrapper, savedImageClass } from './style.css';

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

    const elms = wrapper.querySelectorAll<HTMLDivElement>('[data-position]');
    elms.forEach((elm, idx) => {
      const xPercentage: number = parseFloat(
        elm.getAttribute('data-xpercentage') ?? '0',
      );
      const yPercentage: number = parseFloat(
        elm.getAttribute('data-ypercentage') ?? '0',
      );

      const [xPos, yPos] = getPosition<HTMLDivElement>(elm, img, {
        xPercentage,
        yPercentage,
      });

      elm.style.display = 'flex';
      elm.style.top = `${yPos}px`;
      elm.style.left = `${xPos}px`;
    });
  };

  useEffect(() => {
    setMarkers();
    window.addEventListener('resize', setMarkers);

    return () => {
      window.removeEventListener('resize', setMarkers);
    };
  }, [wrapperRef.current, imgRef.current, data.properties?.signees]);

  return (
    <>
      <section ref={wrapperRef} className={imageWrapper}>
        <img
          ref={imgRef}
          src={getIPFSLink(data.image)}
          onLoad={setMarkers}
          className={savedImageClass}
        />
        <div className={gradientClass} />

        {data?.properties?.signees?.map((s, idx) => {
          const position = s.position;
          if (!position || !position?.xPercentage || !position.yPercentage)
            return null;
          return (
            <SigneePosition
              variant="small"
              key={s.name}
              position={position}
              idx={idx}
            />
          );
        })}
      </section>
    </>
  );
};
