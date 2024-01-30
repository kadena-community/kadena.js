import { useSocket } from '@/hooks/socket';
import deepEqual from 'deep-equal';
import type { Canvas } from 'fabric';
import { fabric } from 'fabric';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { canvasClass } from './styles.css';

export const AvatarEditor: FC = () => {
  const { id: tokenId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas>(null);
  const [freeDrawMode, setFreeDrawMode] = useState(false);
  const { addObject, proofOfUs } = useSocket();
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

    //if (!deepEqual(proofOfUs?.avatar.objects, json.objects)) {
    fabricRef.current.loadFromJSON({ objects: objs });
    //}
  }, [proofOfUs]);
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

  return (
    <section>
      <h2>fabric editor</h2>
      <button onClick={handleFreeDraw}>
        {' '}
        freeDraw {freeDrawMode.toString()}
      </button>
      <canvas ref={canvasRef} className={canvasClass} />
    </section>
  );
};
