import type { FC } from 'react';
import React from 'react';
import { Stack } from './../../..';
import './style.css';

export interface ISuccessCircleProps {
  play: boolean;
  size: number;
  positioning?: { x: string; y: string };
}

export const SuccessCircle: FC<ISuccessCircleProps> = ({
  play,
  size,
  positioning,
}) => {
  const strokeWidth = 3;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Stack
      style={{
        position: 'absolute',
        transform: `translate(${positioning?.x || 0}, ${positioning?.y || 0})`,
      }}
    >
      <svg
        className="animationClass"
        data-play={play}
        id="heart-svg"
        viewBox="467 392 58 57"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="Group"
          fill="none"
          fillRule="evenodd"
          transform="translate(467 392)"
        >
          <circle
            strokeWidth={strokeWidth}
            fill="#AAB8C2"
            id="circle"
            cx="29.5"
            cy="29.5"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />

          <circle
            id="main-circ"
            fill="#E2264D"
            opacity="0"
            cx="29.5"
            cy="29.5"
            r={radius}
          />

          <g id="grp7" opacity="0" transform="translate(7 6)">
            <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2.5" />
            <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2.5" />
          </g>

          <g id="grp6" opacity="0" transform="translate(0 28)">
            <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2.5" />
            <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2.5" />
          </g>

          <g id="grp3" opacity="0" transform="translate(52 28)">
            <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2.5" />
            <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2.5" />
          </g>

          <g id="grp2" opacity="0" transform="translate(44 6)">
            <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2.5" />
            <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2.5" />
          </g>

          <g id="grp5" opacity="0" transform="translate(14 50)">
            <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2.5" />
            <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2.5" />
          </g>

          <g id="grp4" opacity="0" transform="translate(35 50)">
            <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2.5" />
            <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2.5" />
          </g>

          <g id="grp1" opacity="0" transform="translate(24)">
            <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2.5" />
            <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2.5" />
          </g>
        </g>
      </svg>
    </Stack>
  );
};
