import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import { MonoClose } from '@kadena/react-icons';
import classnames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  cameraButton,
  cameraClass,
  cameraWrapperClass,
  canvasClass,
  headerClass,
  hiddenClass,
  wrapperClass,
} from './styles.css';

interface IProps {
  next: () => void;
  status?: IBuildStatusValues;
}

export const AvatarEditor: FC<IProps> = ({ next, status }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { addBackground } = useAvatar();
  const { proofOfUs, updateProofOfUs, updateBackgroundColor } = useProofOfUs();

  useEffect(() => {
    // if someone is already signing the pou, you are not allowed to change the photo anymore
    if (isAlreadySigning(proofOfUs)) {
      next();
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!proofOfUs) return;
    if (!videoRef.current || !isMounted) return;

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        if (!videoRef.current) return;
        if (!canvasRef.current) return;

        videoRef.current.srcObject = stream;
        const containerWidth = (videoRef.current.parentNode as HTMLElement)
          ?.offsetWidth;
        const containerHeight = (videoRef.current.parentNode as HTMLElement)
          ?.offsetHeight;

        canvasRef.current.width = containerWidth * 0.9;
        canvasRef.current.height = containerWidth * 0.9;
        const topIndent = 100;
        const context = canvasRef.current.getContext('2d');
        context?.translate(canvasRef.current.width, 0);
        context?.scale(-1, 1);

        function updateCanvas() {
          if (!videoRef.current) return;
          if (!canvasRef.current) return;

          const newWidth =
            (videoRef.current.videoWidth * containerHeight) /
            videoRef.current.videoHeight;

          context?.drawImage(
            videoRef.current,
            canvasRef.current.width / 2 - newWidth / 2,
            -topIndent,
            newWidth,
            containerHeight,
          );

          window.requestAnimationFrame(updateCanvas);
        }

        requestAnimationFrame(updateCanvas);
      })
      .catch((e) => {
        alert('The browser needs permissions for the camera to work');
      });
  }, [isMounted, proofOfUs]);

  useEffect(() => {
    return () => {
      const src = videoRef.current?.srcObject as MediaStream;
      if (!src) return;
      src.getTracks().forEach((t) => t.stop());
    };
  }, [pathname, status]);

  const handleCapture = async (evt: MouseEvent<HTMLButtonElement>) => {
    if (isAlreadySigning(proofOfUs)) return;
    evt.preventDefault();

    if (!videoRef.current) return;
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');

    // get color
    const color = `rgba(${context?.getImageData(0, 0, 1, 1).data.join(',')})`;

    if (!proofOfUs) return;

    await addBackground(proofOfUs, { bg: canvasRef.current.toDataURL() });

    console.log('update in avatareditor');
    await updateProofOfUs({
      backgroundColor: updateBackgroundColor(color),
    });

    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());

    next();
  };

  return (
    <section className={wrapperClass}>
      <div className={headerClass}>
        <TitleHeader
          label="Say Cheese"
          Append={() => (
            <Link href="/user">
              <MonoClose />
            </Link>
          )}
        />
      </div>
      {!isMounted && <div>loading</div>}
      <div
        className={classnames(
          cameraWrapperClass,
          !isMounted ? hiddenClass : '',
        )}
      >
        <canvas
          ref={canvasRef}
          className={classnames(canvasClass, !isMounted ? hiddenClass : '')}
        ></canvas>
        <video
          className={classnames(cameraClass, !isMounted ? hiddenClass : '')}
          ref={videoRef}
          id="player"
          controls={false}
          autoPlay
          muted
          playsInline
        ></video>
        {!isAlreadySigning(proofOfUs) && (
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
