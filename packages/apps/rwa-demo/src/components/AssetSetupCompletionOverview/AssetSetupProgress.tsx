import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useAssetSetup } from '@/hooks/assetSetup';
import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import {
  progressRing,
  progressRingBackground,
  progressRingCircle,
} from './style.css';

export const AssetSetupProgress: FC<{ asset?: IAsset }> = ({ asset }) => {
  const { percentageComplete } = useAssetSetup({ tempAsset: asset });
  const circleRef = useRef<SVGCircleElement>(null);

  const strokeWidth = 3;
  const size = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const offset = circumference - (percentageComplete / 100) * circumference;
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [percentageComplete, circumference]);

  if (!asset) return;
  return (
    <Stack
      gap="sm"
      alignItems="center"
      justifyContent="flex-end"
      marginInlineStart="sm"
      style={{ whiteSpace: 'nowrap' }}
    >
      <Text size="smallest">setup progress</Text>
      <Stack position="relative" style={{ width: size, height: size }}>
        <svg className={progressRing} width={size} height={size}>
          <circle
            className={progressRingBackground}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={100}
            strokeDashoffset={0}
          />
        </svg>
        <svg className={progressRing} width={size} height={size}>
          <circle
            ref={circleRef}
            className={progressRingCircle}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
      </Stack>
    </Stack>
  );
};
