import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useRef } from 'react';

export const ImagePositions: FC = () => {
  const { proofOfUs, updateSigner } = useProofOfUs();
  const { account } = useAccount();
  const { background } = useProofOfUs();
  const imgRef = useRef<HTMLImageElement>(null);

  const signer = proofOfUs?.signees.find((c) => c.cid === account?.cid);

  const handleClick: MouseEventHandler<HTMLImageElement> = (e) => {
    if (!imgRef.current) return;

    // Calculate the coordinates relative to the image
    const rect = imgRef.current.getBoundingClientRect();
    const xPercentage = ((e.clientX - rect.left) / imgRef.current.width) * 100;
    const yPercentage = ((e.clientY - rect.top) / imgRef.current.height) * 100;

    updateSigner({ position: { xPercentage, yPercentage } });
  };

  const handleLabelChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    //TODO: this needs to debounce
    if (!proofOfUs) return;
    updateSigner({
      label: e.target.value,
    });
  };

  return (
    <section>
      <input
        type="text"
        name="label"
        placeholder="label"
        defaultValue={signer?.label}
        onChange={handleLabelChange}
      />
      <img ref={imgRef} src={background} onClick={handleClick} />
    </section>
  );
};
