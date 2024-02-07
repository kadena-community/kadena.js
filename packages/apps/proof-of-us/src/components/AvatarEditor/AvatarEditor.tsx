import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import classnames from 'classnames';
import { fabric } from 'fabric';
import type { Canvas } from 'fabric/fabric-impl';
import { useParams } from 'next/navigation';
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
  const { id: proofOfUsId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const { setBackgroundSocket } = useAvatar();
  const canvasElm = canvasRef.current;
  const { proofOfUs, background } = useProofOfUs();

  useEffect(() => {
    // if someone is already signing the pou, you are not allowed to change the photo anymore
    if (isAlreadySigning(proofOfUs?.signees)) {
      next();
    }
  });

  useEffect(() => {
    if (!fabricRef.current || !proofOfUs) return;

    fabric.Image.fromURL(background ?? '', function (img) {
      img.scaleToWidth(800);
      img.scaleToHeight(800);
      fabricRef.current?.setBackgroundImage(img, () => {});
      fabricRef.current?.requestRenderAll();
    });
  }, [proofOfUs]);

  useEffect(() => {
    if (!videoRef.current) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;

      setTimeout(() => {
        setIsMounted(true);
      }, 200);
    });
  }, []);

  useEffect(() => {
    if (!canvasElm) return;

    fabricRef.current = new fabric.Canvas(canvasElm, {
      width: 800,
      height: 800,
    });

    fabricRef.current.isDrawingMode = false;
  }, [canvasElm]);

  const handleCapture = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!videoRef.current || !fabricRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    fabric.Image.fromURL(canvas.toDataURL(), function (img) {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      fabricRef.current?.setBackgroundImage(img, () => {});
      fabricRef.current?.requestRenderAll();
    });

    await setBackgroundSocket(proofOfUsId.toString(), canvas.toDataURL());
    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());

    next();
  };

  return (
    <section className={wrapperClass}>
      {!isMounted && <div>loading</div>}

      <canvas ref={canvasRef} className={classnames(hiddenClass)} />
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
          controls
          autoPlay
        ></video>
        <button className={cameraButton} id="capture" onClick={handleCapture} />
      </div>
    </section>
  );
};
