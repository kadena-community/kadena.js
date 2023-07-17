import type { SVGProps } from 'react';
import * as React from 'react';

const Gas: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 40 40"
    {...props}
  >
    <g clipPath="url(#gas-icon_svg__a)">
      <path
        fill="#fff"
        d="M27.636 11.643a1.727 1.727 0 1 0 0-3.454 1.727 1.727 0 0 0 0 3.454Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
      <path
        fill="#fff"
        d="M30.334 13.704a7.146 7.146 0 0 0-8.096-1.414v-1.249a2.57 2.57 0 0 0-2.57-2.57h-7.713a2.57 2.57 0 0 0-2.57 2.57v18a2.572 2.572 0 0 0 2.57 2.57h7.712a2.572 2.572 0 0 0 2.571-2.57v-1.502a2.367 2.367 0 0 0 2.264-1.675 7.148 7.148 0 0 0 5.83-12.16h.002Zm-18.38-2.663h7.713v3.295a7.132 7.132 0 0 0-1.416 3.131h-6.296v-6.426ZM28.422 22.86a2.861 2.861 0 1 1-.01-5.722 2.861 2.861 0 0 1 .01 5.722Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
      <path
        fill="#F90"
        d="M19.667 17.467h-7.712v-6.42h7.712m2.571 0a2.57 2.57 0 0 0-2.57-2.571h-7.713a2.57 2.57 0 0 0-2.57 2.57v18a2.571 2.571 0 0 0 2.57 2.57h7.712a2.571 2.571 0 0 0 2.571-2.57v-18Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
      <path
        fill="#6C3"
        d="M27.636 11.643a1.729 1.729 0 1 1-.002-3.458 1.729 1.729 0 0 1 .002 3.458Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
      <path
        fill="#27B7E6"
        d="M30.334 13.704a7.148 7.148 0 1 0-10.106 10.112 7.148 7.148 0 0 0 10.106-10.112Zm-1.913 9.158a2.861 2.861 0 1 1-.01-5.718 2.861 2.861 0 0 1 .01 5.716v.002Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
      <path
        fill="#ED098F"
        d="M22.238 27.539a2.368 2.368 0 1 1-.007-4.736 2.368 2.368 0 0 1 .007 4.736Z"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
    </g>
    <defs>
      <clipPath id="gas-icon_svg__a">
        <path fill="#fff" d="M0 0h40v40H0z" />
      </clipPath>
    </defs>
  </svg>
);
export { Gas };
