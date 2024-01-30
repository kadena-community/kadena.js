import { useSocket } from '@/hooks/socket';
import deepEqual from 'deep-equal';
import type { Canvas } from 'fabric';
import { fabric } from 'fabric';
import { useParams } from 'next/navigation';
import type { FC, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { canvasClass, modalClass } from './styles.css';

export const AvatarEditor: FC = () => {
  const { id: tokenId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bg, setBg] = useState<string | undefined>();
  const [freeDrawMode, setFreeDrawMode] = useState(false);
  const { addObject, proofOfUs, setBackgroundSocket } = useSocket();
  const canvasElm = canvasRef.current;

  useEffect(() => {
    if (!fabricRef.current) return;

    fabricRef.current.clear();
    const json = fabricRef.current.toJSON();

    const objs = proofOfUs?.avatar.objects.map((o) => {
      return {
        ...o,
        isInitLoad: true,
        previousState: { ...o },
      };
    });

    fabric.Image.fromURL(proofOfUs?.avatar.background, function (img) {
      img.scaleToWidth(500);
      img.scaleToHeight(500);
      fabricRef.current.setBackgroundImage(img);
      fabricRef.current.requestRenderAll();
    });

    //if (!deepEqual(proofOfUs?.avatar.objects, json.objects)) {
    fabricRef.current.loadFromJSON({ objects: objs });
    //}
  }, [proofOfUs]);

  useEffect(() => {
    if (!videoRef.current && !isModalOpen) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
    });
  }, [isModalOpen]);

  useEffect(() => {
    if (!canvasElm || fabricRef.current) return;

    fabricRef.current = new fabric.Canvas(canvasElm, {
      width: 500,
      height: 500,
    });

    fabricRef.current.isDrawingMode = freeDrawMode;
    fabricRef.current.freeDrawingBrush.width = 4;
    fabricRef.current.freeDrawingBrush.color = '#000';

    fabricRef.current.on('object:added', ({ target }) => {
      if (!target.isInitLoad) {
        delete target.isInitLoad;
        const newTarget = {
          ...target.toJSON(),
          previousState: target.toJSON(),
        };
        addObject(tokenId, newTarget);
      }
    });
    fabricRef.current.on('object:modified', ({ target }) => {
      console.log(2222, target.toJSON(), target.previousState);
      //   if (!target.isInitLoad) {
      //     delete target.isInitLoad;
      const { previousState, ...newTarget } = target;
      addObject(tokenId, newTarget, previousState);
      //   }
    });
  }, [canvasElm]);

  const handleFreeDraw = () => {
    const newVal = !freeDrawMode;
    fabricRef.current.isDrawingMode = newVal;
    setFreeDrawMode(newVal);
  };

  const handleToggleCaptureModal = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    setIsModalOpen((v) => !v);
  };

  const clearBackground = () => {
    setBackgroundSocket(tokenId.toString(), '');
  };

  const handleCapture = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    fabric.Image.fromURL(canvas.toDataURL(), function (img) {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      fabricRef.current.setBackgroundImage(img);
      fabricRef.current.requestRenderAll();
    });

    console.log(fabricRef.current);

    setBackgroundSocket(tokenId.toString(), canvas.toDataURL());

    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());

    setIsModalOpen(false);
  };

  return (
    <section>
      <h2>fabric editor</h2>
      <button onClick={handleToggleCaptureModal}>Capture</button>
      <button onClick={handleFreeDraw}>
        freeDraw {freeDrawMode.toString()}
      </button>
      <button onClick={clearBackground}>clear background</button>
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
