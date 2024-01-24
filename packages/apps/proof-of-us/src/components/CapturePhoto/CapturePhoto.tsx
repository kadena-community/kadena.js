import type { FC, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactSketchCanvas from 'react-canvas-draw';
import { modalClass } from './styles.css';

export const CapturePhoto: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bg, setBg] = useState(undefined);

  useEffect(() => {
    if (!videoRef.current && !isModalOpen) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
    });
  }, [isModalOpen]);

  const handleCapture = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!canvasRef.current || !videoRef.current) return;
    console.log(canvasRef.current);
    //const canvas = canvasRef.current.querySelector('svg');
    const context = canvasRef.current.ctx.drawing;

    console.log(videoRef.current, canvasRef.current.innerHTML);
    //setBg(videoRef.current);

    context?.drawImage(videoRef.current, 0, 0, 320, 240);

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

      <div>
        <ReactSketchCanvas
          hideGridX={true}
          hideGridY={false}
          canvasWidth={320}
          canvasHeight={240}
          ref={canvasRef}
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
