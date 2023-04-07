import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={18}
    height={21}
    viewBox="0 0 18 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 17V18H0V17L2 15V9C2 5.9 4.03 3.17 7 2.29C7 2.19 7 2.1 7 2C7 1.46957 7.21071 0.960859 7.58579 0.585786C7.96086 0.210714 8.46957 0 9 0C9.53043 0 10.0391 0.210714 10.4142 0.585786C10.7893 0.960859 11 1.46957 11 2C11 2.1 11 2.19 11 2.29C13.97 3.17 16 5.9 16 9V15L18 17ZM11 19C11 19.5304 10.7893 20.0391 10.4142 20.4142C10.0391 20.7893 9.53043 21 9 21C8.46957 21 7.96086 20.7893 7.58579 20.4142C7.21071 20.0391 7 19.5304 7 19"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
