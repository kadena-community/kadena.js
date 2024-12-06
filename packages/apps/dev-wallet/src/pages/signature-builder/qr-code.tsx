'use client';

/// <reference types="./qram.d.ts" />
import { encodeURL } from 'js-base64';
import { Encoder } from 'qram';
import { useEffect, useState } from 'react';
import QR from 'react-qr-code';

const textEncoder = new TextEncoder();
export const QRCode = ({ payload }: { payload: string }) => {
  console.warn('DEBUGPRINT[1]: qr-code.tsx:10: payload=', JSON.parse(payload));
  const [qrCode, setQRCode] = useState<string>();
  useEffect(() => {
    let stream: ReadableStream;
    const updateQRCode = async () => {
      const p = textEncoder.encode(payload);
      const encoder = new Encoder({ data: p, blockSize: 256 });
      const fps = 6;
      const timer = encoder.createTimer({ fps });
      stream = await encoder.createReadableStream();

      const reader = stream.getReader();
      timer.start();

      const readRecursive = async () => {
        const { value, done } = await reader.read();
        if (done) {
          return;
        }
        setQRCode(encodeURL(value.data));
        await timer.nextFrame();
        readRecursive();
      };
      readRecursive();
    };
    updateQRCode();

    return () => {
      stream?.cancel();
    };
  }, [payload]);
  if (!qrCode) {
    return null;
  }

  return <QR value={qrCode} />;
};
