import type { SVGProps } from 'react';
import * as React from 'react';

const PactLanguage: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1080_2290)">
      <path
        d="M89.06,340.63a17,17,0,0,1-17-17V56a17,17,0,0,1,17-17H236.54a104.46,104.46,0,1,1,0,208.91H190.33v75.72a17,17,0,0,1-17,17Z"
        fill="white"
      />
      <g style={{ mixBlendMode: 'multiply' }}>
        <path
          d="M9.37473 4.21053H19.9295V34.0663C19.9295 34.513 19.752 34.9414 19.4362 35.2572C19.1203 35.5731 18.6919 35.7505 18.2453 35.7505H9.37473C8.92805 35.7505 8.49967 35.5731 8.18382 35.2572C7.86796 34.9414 7.69052 34.513 7.69052 34.0663V5.89474C7.69052 5.44806 7.86796 5.01967 8.18382 4.70382C8.49967 4.38797 8.92805 4.21053 9.37473 4.21053Z"
          fill="#ED098F"
        />
      </g>
      <g style={{ mixBlendMode: 'multiply' }}>
        <path
          d="M9.37473 4.21053H24.8989C27.7873 4.21053 30.5573 5.35792 32.5997 7.40029C34.6421 9.44266 35.7895 12.2127 35.7895 15.1011C35.7892 17.9892 34.6417 20.759 32.5993 22.8011C30.557 24.8433 27.7871 25.9905 24.8989 25.9905H7.69052V5.89474C7.69052 5.44806 7.86796 5.01967 8.18382 4.70382C8.49967 4.38797 8.92805 4.21053 9.37473 4.21053Z"
          fill="#27B7E6"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_1080_2290">
        <rect width="40" height="40" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export { PactLanguage };
