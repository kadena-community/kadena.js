import { useSocket } from '@/hooks/socket';
import { useParams } from 'next/navigation';
import type { FC, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { modalClass } from './styles.css';

export const CapturePhoto: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<IReactSketchCanvasRef>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bg, setBg] = useState<string | undefined>();
  const { setBackgroundSocket, setLinesSocket, proofOfUs } = useSocket();
  const { id: tokenId } = useParams();

  useEffect(() => {
    if (!canvasRef.current || !proofOfUs) return;

    setBg(proofOfUs?.avatar.background);
    canvasRef.current.clearCanvas();
    canvasRef.current.loadPaths(proofOfUs.avatar.lines);
  }, [proofOfUs?.avatar.background, proofOfUs?.avatar.lines]);

  useEffect(() => {
    if (!canvasWrapperRef.current) return;

    canvasWrapperRef.current.addEventListener('mouseup', async () => {
      const lines = (await canvasRef.current?.exportPaths()) ?? [];
      setLinesSocket(tokenId.toString(), lines);
    });
  }, [canvasWrapperRef.current]);

  useEffect(() => {
    if (!videoRef.current && !isModalOpen) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
    });
  }, [isModalOpen]);

  const handleCapture = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 240;
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    setBg(canvas.toDataURL());
    setBackgroundSocket(tokenId.toString(), canvas.toDataURL());

    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());

    setIsModalOpen(false);
  };

  const handleToggleCaptureModal = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    setIsModalOpen((v) => !v);
  };

  return (
    <div>
      <button onClick={handleToggleCaptureModal}>Capture</button>

      <div ref={canvasWrapperRef}>
        <ReactSketchCanvas
          width="320"
          height="240"
          strokeWidth={4}
          strokeColor="red"
          ref={canvasRef}
          backgroundImage={bg}
        />
      </div>

      {isModalOpen && (
        <section className={modalClass}>
          <input type="file" accept="image/*" capture="user" />

          <video ref={videoRef} id="player" controls autoPlay></video>
          <button id="capture" onClick={handleCapture}>
            Capture
          </button>
        </section>
      )}
    </div>
  );
};
