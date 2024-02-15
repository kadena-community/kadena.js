import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoDoNotStep = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-style="mono"
    viewBox="0 0 24 24"
    fontSize="1.5em"
    fill="currentColor"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="m1.39 4.22 7.9 7.9c.18.2.18.5-.01.7a.485.485 0 0 1-.7 0L6.87 11.1c-.11.4-.26.78-.45 1.12l1.4 1.4c.2.2.2.51 0 .71a.485.485 0 0 1-.7 0l-1.27-1.27c-.24.29-.5.56-.77.8l1.28 1.28c.2.2.2.51 0 .71-.1.1-.23.15-.36.15s-.26-.05-.35-.15l-1.38-1.38c-.69.46-1.39.79-1.97 1.02-.78.31-1.3 1.04-1.3 1.88V20h9.5l3.33-3.33 5.94 5.94 1.41-1.41L2.81 2.81zm17.12 11.46-1.41-1.41 4.48-4.48L23 11.2zm2.37-6.6-4.48 4.48-7.1-7.09L13.8 2z" />
  </svg>
);
export default MonoDoNotStep;
