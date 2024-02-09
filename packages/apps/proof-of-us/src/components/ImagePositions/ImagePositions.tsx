import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import { signeeClass, wrapperClass } from './style.css';

interface IProps {}

export const ImagePositions: FC<IProps> = () => {
  const { proofOfUs, updateSigner } = useProofOfUs();
  const { account } = useAccount();
  const { background } = useProofOfUs();
  const [isMounted, setIsMounted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [signer, setSigner] = useState<IProofOfUsSignee>();
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSigner(proofOfUs?.signees.find((c) => c.cid === account?.cid));
    setIsLocked(isAlreadySigning(proofOfUs?.signees));
  }, [proofOfUs]);

  const setMarkers = () => {
    if (!wrapperRef.current || !imgRef.current || !isMounted) return;
    const wrapper = wrapperRef.current;
    const img = imgRef.current;

    const elms = wrapper.querySelectorAll('button');

    elms.forEach((elm) => {
      const xPercentage: number = parseFloat(
        elm.getAttribute('data-xpercentage') ?? '0',
      );
      const yPercentage: number = parseFloat(
        elm.getAttribute('data-ypercentage') ?? '0',
      );

      if (!xPercentage || !yPercentage) {
        elm.setAttribute('style', `display: 'none'`);
        return;
      }

      elm.setAttribute(
        'style',
        `
        display: flex;
        top: ${(yPercentage / 100) * img.height}px;
        left: ${(xPercentage / 100) * img.width}px;
      `,
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
      <input
        type="text"
        name="label"
        placeholder="label"
        defaultValue={signer?.label}
        onChange={handleLabelChange}
      />
      <section ref={wrapperRef} className={wrapperClass}>
        <img
          ref={imgRef}
          src={background}
          onClick={handleClick}
          onLoad={() => setIsMounted(true)}
        />
        {proofOfUs?.signees.map((signee, idx) => (
          <button
            className={signeeClass}
            key={signee.cid}
            data-xpercentage={signee.position?.xPercentage}
            data-ypercentage={signee.position?.yPercentage}
            onClick={handleRemove}
          >
            {idx}
          </button>
        ))}
      </section>
    </>
  );
};
