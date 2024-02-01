import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { fabric } from 'fabric';
import type { Canvas } from 'fabric/fabric-impl';
import { useParams } from 'next/navigation';
import type { FC, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { canvasClass, modalClass } from './styles.css';

export const AvatarEditor: FC = () => {
  const { id: proofOfUsId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setBackgroundSocket, uploadBackground } = useAvatar();
  const canvasElm = canvasRef.current;
  const { proofOfUs } = useProofOfUs();

  useEffect(() => {
    if (!fabricRef.current || !proofOfUs) return;

    fabric.Image.fromURL(proofOfUs.avatar?.background ?? '', function (img) {
      img.scaleToWidth(100);
      img.scaleToHeight(100);
      fabricRef.current?.setBackgroundImage(img, () => {});
      fabricRef.current?.requestRenderAll();
    });
  }, [proofOfUs]);

  useEffect(() => {
    if (!videoRef.current && !isModalOpen) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
    });
  }, [isModalOpen]);

  useEffect(() => {
    if (!canvasElm) return;

    fabricRef.current = new fabric.Canvas(canvasElm, {
      width: 100,
      height: 100,
    });

    fabricRef.current.isDrawingMode = false;
  }, [canvasElm]);

  const handleToggleCaptureModal = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    setIsModalOpen((v) => !v);
  };

  const clearBackground = () => {
    setBackgroundSocket(proofOfUsId.toString(), '');
  };

  const handleCapture = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!videoRef.current || !fabricRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    fabric.Image.fromURL(canvas.toDataURL(), function (img) {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      fabricRef.current?.setBackgroundImage(img, () => {});
      fabricRef.current?.requestRenderAll();
    });

    setBackgroundSocket(proofOfUsId.toString(), canvas.toDataURL());

    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());

    setIsModalOpen(false);
  };

  const handleUpload = async () => {
    if (!proofOfUs?.avatar.background) return;

    uploadBackground(proofOfUsId.toString(), proofOfUs?.avatar.background);
  };

  return (
    <section>
      <h2>fabric editor</h2>
      <button onClick={handleToggleCaptureModal}>Capture</button>

      <button onClick={clearBackground}>clear background</button>
      <button onClick={handleUpload}>upload</button>
      <canvas ref={canvasRef} className={canvasClass} />

      {isModalOpen && (
        <section className={modalClass}>
          <video ref={videoRef} id="player" controls autoPlay></video>
          <button id="capture" onClick={handleCapture}>
            Capture
          </button>
        </section>
      )}
    </section>
  );
};
