import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC } from 'react';
import React from 'react';
import type { button } from 'src/components/Button/Button.css';
import { Stack } from './../../..';
import { token } from './../../../../styles';
import { grpClass, mainCircleClass, oval1Class, oval2Class } from './style.css';

type Variants = NonNullable<RecipeVariants<typeof button>>;
export interface ISuccessCircleProps {
  play: boolean;
  size: number;
  positioning?: { x: string; y: string };
  variant?: Variants['variant'];
}

export const SuccessCircle: FC<ISuccessCircleProps> = ({
  play,
  size,
  positioning,
  variant = 'primary',
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
            id="circle"
            cx="29.5"
            cy="29.5"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />

          <circle
            className={mainCircleClass({ variant })}
            data-play={play}
            id="main-circ"
            opacity="0"
            cx="29.5"
            cy="29.5"
            r={radius}
          />

          <g
            id="grp7"
            opacity="0"
            transform="translate(7 6)"
            className={grpClass({ play })}
          >
            <circle
              id="oval1"
              fill={token('color.background.accent.primary.inverse.default')}
              cx="2"
              cy="6"
              r="2.5"
              className={oval1Class({ play })}
            />
            <circle
              id="oval2"
              fill={token('color.background.semantic.warning.inverse.default')}
              cx="5"
              cy="2"
              r="2.5"
              className={oval2Class({ play })}
            />
          </g>

          <g
            id="grp6"
            opacity="0"
            transform="translate(0 28)"
            className={grpClass({ play })}
          >
            <circle
              id="oval1"
              fill={token('color.background.semantic.negative.inverse.@active')}
              cx="2"
              cy="7"
              r="2.5"
              className={oval1Class({ play })}
            />
            <circle
              id="oval2"
              fill={token('color.background.semantic.positive.inverse.@hover')}
              cx="3"
              cy="2"
              r="2.5"
              className={oval2Class({ play })}
            />
          </g>

          <g
            id="grp3"
            opacity="0"
            transform="translate(52 28)"
            className={grpClass({ play })}
          >
            <circle
              id="oval2"
              fill={token('color.background.accent.primary.inverse.@active')}
              cx="2"
              cy="7"
              r="2.5"
              className={oval2Class({ play })}
            />
            <circle
              id="oval1"
              fill={token('color.background.semantic.warning.inverse.@hover')}
              cx="4"
              cy="2"
              r="2.5"
              className={oval1Class({ play })}
            />
          </g>

          <g
            id="grp2"
            opacity="0"
            transform="translate(44 6)"
            className={grpClass({ play })}
          >
            <circle
              id="oval2"
              fill={token('color.background.semantic.negative.inverse.@active')}
              cx="5"
              cy="6"
              r="2.5"
              className={oval2Class({ play })}
            />
            <circle
              id="oval1"
              fill={token('color.background.semantic.negative.inverse.@hover')}
              cx="2"
              cy="2"
              r="2.5"
              className={oval1Class({ play })}
            />
          </g>

          <g
            id="grp5"
            opacity="0"
            transform="translate(14 50)"
            className={grpClass({ play })}
          >
            <circle
              id="oval1"
              fill={token('color.background.semantic.positive.inverse.default')}
              cx="6"
              cy="5"
              r="2.5"
              className={oval1Class({ play })}
            />
            <circle
              id="oval2"
              fill={token('color.background.semantic.positive.inverse.@hover')}
              cx="2"
              cy="2"
              r="2.5"
              className={oval2Class({ play })}
            />
          </g>

          <g
            id="grp4"
            opacity="0"
            transform="translate(35 50)"
            className={grpClass({ play })}
          >
            <circle
              id="oval1"
              fill={token('color.background.semantic.info.inverse.default')}
              cx="6"
              cy="5"
              r="2.5"
              className={oval1Class({ play })}
            />
            <circle
              id="oval2"
              fill={token('color.background.semantic.info.inverse.@hover')}
              cx="2"
              cy="2"
              r="2.5"
              className={oval2Class({ play })}
            />
          </g>

          <g
            id="grp1"
            opacity="0"
            transform="translate(24)"
            className={grpClass({ play })}
          >
            <circle
              id="oval1"
              fill={token('color.background.semantic.positive.inverse.@hover')}
              cx="2.5"
              cy="3"
              r="2.5"
              className={oval1Class({ play })}
            />
            <circle
              id="oval2"
              fill={token('color.background.semantic.positive.inverse.@hover')}
              cx="7.5"
              cy="2"
              r="2.5"
              className={oval2Class({ play })}
            />
          </g>
        </g>
      </svg>
    </Stack>
  );
};
