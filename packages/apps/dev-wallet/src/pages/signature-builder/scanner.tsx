'use client';
import { toUint8Array } from 'js-base64';
import jsqr from 'jsqr';
import { Decoder, getImageData } from 'qram';
import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
const textDecoder = new TextDecoder();
type QRScannerProps = {
  onScanned: (data: any) => void;
};
export const QRScanner = ({ onScanned }: QRScannerProps) => {
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  useEffect(() => {
    const decoder = new Decoder();
    decoder
      .decode()
      .then((res) => {
        onScanned(JSON.parse(textDecoder.decode(res.data)));
      })
      .catch((e) => {});
    requestAnimationFrame(async function enqueue() {
      try {
        const video: any = webcamRef.current?.video;
        if (!video) return requestAnimationFrame(enqueue);

        const ctx = canvasRef.current.getContext('2d', {
          willReadFrequently: true,
        });
        const imageData = getImageData({
          source: video,
          canvas: ctx.canvas,
        });
        const res = jsqr(imageData.data, imageData.width, imageData.height);
        console.warn('DEBUGPRINT[5]: qr-scanner.tsx:34: res=', res);

        if (!res) return requestAnimationFrame(enqueue);

        const progress = await decoder.enqueue(toUint8Array(res.data));

        if (!progress.done) requestAnimationFrame(enqueue);
      } catch (e) {}
    });
    return () => {
      decoder.cancel();
    };
  }, []);
  return (
    <>
      <Webcam
        ref={webcamRef}
        height={720}
        width={1280}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: 'environment',
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};
