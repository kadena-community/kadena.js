import * as React from 'react';
import type { SVGProps } from 'react';
const SvgFromIconActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <g clipPath="url(#from-icon-active_svg__a)">
      <path
        fill="#fff"
        d="M6.29 31.815V8.185A1.866 1.866 0 0 1 9.14 6.598L22.6 14.93a6.696 6.696 0 1 1 .016 10.128L9.139 33.402a1.866 1.866 0 0 1-2.848-1.587Z"
      />
      <path
        fill="#6C3"
        d="M26.988 26.684a6.696 6.696 0 1 0 0-13.391 6.696 6.696 0 0 0 0 13.391Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
      <path
        fill="#27B7E6"
        d="M6.29 8.185v23.63a1.866 1.866 0 0 0 2.849 1.587l19.085-11.815a1.868 1.868 0 0 0 0-3.174L9.14 6.598A1.866 1.866 0 0 0 6.29 8.185Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
    </g>
    <defs>
      <clipPath id="from-icon-active_svg__a">
        <path fill="#fff" d="M0 0h40v40H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgFromIconActive;
