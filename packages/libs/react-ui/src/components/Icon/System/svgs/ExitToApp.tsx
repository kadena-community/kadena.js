import * as React from 'react';
import { type SVGProps } from 'react';

const ExitToApp: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="currentColor"
      d="M19 3H5C3.89 3 3 3.89 3 5V9H5V5H19V19H5V15H3V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 3.89 20.1 3 19 3ZM10.08 15.58L11.5 17L16.5 12L11.5 7L10.08 8.41L12.67 11H3V13H12.67L10.08 15.58Z"
    />
  </svg>
);

export { ExitToApp };
