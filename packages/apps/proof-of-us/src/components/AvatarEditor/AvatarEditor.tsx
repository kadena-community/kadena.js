import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import classnames from 'classnames';
import type { FC, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  cameraButton,
  cameraClass,
  cameraWrapperClass,
  hiddenClass,
  wrapperClass,
} from './styles.css';

interface IProps {
  next: () => void;
}

export const AvatarEditor: FC<IProps> = ({ next }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const { addBackground } = useAvatar();
  const { proofOfUs, updateBackgroundColor } = useProofOfUs();

  useEffect(() => {
    // if someone is already signing the pou, you are not allowed to change the photo anymore
    if (isAlreadySigning(proofOfUs?.signees)) {
      next();
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      (videoRef.current?.srcObject as MediaStream)
        ?.getTracks()
        .forEach((t) => t.stop());
    };
  }, [videoRef.current]);

  useEffect(() => {
    if (!videoRef.current || !isMounted) return;

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      })
      .catch((e) => {
        alert('The browser needs permissions for the camera to work');
      });
  }, [isMounted]);

  const handleCapture = async (evt: MouseEvent<HTMLButtonElement>) => {
    if (isAlreadySigning(proofOfUs?.signees)) return;
    evt.preventDefault();

    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    //get color
    ctx?.drawImage(videoRef.current, 0, 0, 1, 1);
    const color = `rgba(${ctx?.getImageData(0, 0, 1, 1).data.join(',')})`;

    if (!proofOfUs) return;

    await addBackground(proofOfUs, { bg: canvas.toDataURL() });
    await updateBackgroundColor(color);
    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());

    next();
  };

  return (
    <section className={wrapperClass}>
      {!isMounted && <div>loading</div>}
      <canvas ref={canvasRef} />
      <div
        className={classnames(
          cameraWrapperClass,
          !isMounted ? hiddenClass : '',
        )}
      >
        <video
          className={classnames(cameraClass, !isMounted ? hiddenClass : '')}
          ref={videoRef}
          id="player"
          controls={false}
          autoPlay
          muted
          playsInline
        ></video>
        {!isAlreadySigning(proofOfUs?.signees) && (
          <button
            className={cameraButton}
            id="capture"
            onClick={handleCapture}
          />
        )}
      </div>
    </section>
  );
};
