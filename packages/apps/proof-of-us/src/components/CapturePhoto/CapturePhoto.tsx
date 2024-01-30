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
  const [stamp, setStamp] = useState<ICanvasPath[]>();
  const { setBackgroundSocket, setLinesSocket, proofOfUs } = useSocket();
  const { id: tokenId } = useParams();

  useEffect(() => {
    if (!canvasRef.current || !proofOfUs) return;

    setBg(proofOfUs?.avatar.background);
    canvasRef.current.clearCanvas();
    canvasRef.current.loadPaths(proofOfUs.avatar.lines);
  }, [proofOfUs?.avatar.background, proofOfUs?.avatar.lines]);

  const mouseUpHandler = async () => {
    const lines = (await canvasRef.current?.exportPaths()) ?? [];
    setLinesSocket(tokenId.toString(), lines);
  };

  const stampHandler = async (e) => {
    if (stamp) {
      const stampPositioned = positionStamp(
        { x: e.offsetX, y: e.offsetY },
        stamp,
      );

      canvasRef.current?.loadPaths(stampPositioned);
      const lines = (await canvasRef.current?.exportPaths()) ?? [];
      setLinesSocket(tokenId.toString(), [...lines, ...stampPositioned]);
    }
  };
  useEffect(() => {
    if (!canvasWrapperRef.current) return;

    canvasWrapperRef.current.addEventListener('mouseup', mouseUpHandler);

    canvasWrapperRef.current.addEventListener('click', stampHandler);

    return () => {
      canvasWrapperRef.current?.removeEventListener('mouseup', mouseUpHandler);
      canvasWrapperRef.current?.removeEventListener('click', stampHandler);
    };
  }, [canvasWrapperRef.current, stamp]);

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
    canvas.width = 500;
    canvas.height = 500;
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    setBg(canvas.toDataURL());
    setBackgroundSocket(tokenId.toString(), canvas.toDataURL());

    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());

    setIsModalOpen(false);
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    setBackgroundSocket(tokenId.toString(), '');
    setLinesSocket(tokenId.toString(), []);
  };

  const handleToggleCaptureModal = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    setIsModalOpen((v) => !v);
  };

  const positionStamp = (
    clickPosition: { x: number; y: number },
    stamp: ICanvasPath[],
  ): ICanvasPath[] => {
    return stamp.map((path) => {
      let xDelta = 0;
      let yDelta = 0;
      const newPaths = path.paths.map((p, idx) => {
        if (idx === 0) {
          xDelta = p.x - clickPosition.x;
          yDelta = p.y - clickPosition.y;
        }

        console.log(xDelta);

        return { x: p.x - xDelta, y: p.y - yDelta };
      });

      return { ...path, paths: newPaths };
    });
  };

  const getCoordinates = (str: string): string => {
    const regex = /d="([^"]*)"/;
    const match = str.match(regex);

    if (!match) return '';
    return match[1];
  };

  const createPath = (str: string): ICanvasPath[] => {
    const paths: ICanvasPath[] = [];

    const coordinatesStr = getCoordinates(str);
    const coordinates: IPoint[] = coordinatesStr
      .split(/[MZC ]/)
      .filter((c) => c !== '')
      .reduce<IPoint[]>((acc, val) => {
        const last = acc[acc.length - 1];
        const valInt = parseFloat(val);
        if (!last || last.y) {
          acc.push({ x: valInt, y: 0 });
        } else {
          acc[acc.length - 1] = { ...last, y: valInt };
        }

        return acc;
      }, []);

    const path: ICanvasPath = {
      drawMode: true,
      strokeColor: '#000000',
      strokeWidth: 3,
      paths: coordinates,
    };

    paths.push(path);
    return paths;
  };

  const selectStamp = () => {
    if (stamp) setStamp(undefined);

    setStamp(
      createPath(
        '<path d="M70.9497 422.242C104.922 420.459 112.838 457.534 80.6247 468.616C43.3367 481.551 32.6017 424.748 70.9497 422.242Z" fill="#000000"/>',
      ),
    );
  };

  return (
    <div>
      <button onClick={handleToggleCaptureModal}>Capture</button>
      <button onClick={selectStamp}>
        toggle stamp ({Boolean(stamp).toString()})
      </button>
      <button onClick={handleClear}>clear</button>
      <div ref={canvasWrapperRef}>
        <ReactSketchCanvas
          width="500px"
          height="500px"
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
