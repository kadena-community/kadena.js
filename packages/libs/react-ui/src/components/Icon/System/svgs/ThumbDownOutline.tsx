import * as React from 'react';
import { SVGProps } from 'react';

const ThumbDownOutline: React.FC<SVGProps<SVGSVGElement>> = (
  props: SVGProps<SVGSVGElement>,
) => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.25 11.25V2.25H17.25V11.25H14.25ZM11.25 2.25C11.6478 2.25 12.0294 2.40804 12.3107 2.68934C12.592 2.97064 12.75 3.35218 12.75 3.75V11.25C12.75 11.6625 12.585 12.0375 12.3075 12.3075L7.3725 17.25L6.5775 16.455C6.375 16.2525 6.2475 15.975 6.2475 15.66L6.27 15.4275L6.9825 12H2.25C1.4175 12 0.75 11.325 0.75 10.5V9C0.75 8.805 0.7875 8.625 0.855 8.4525L3.12 3.165C3.345 2.625 3.8775 2.25 4.5 2.25H11.25ZM11.25 3.75H4.4775L2.25 9V10.5H8.835L7.9875 14.49L11.25 11.2275V3.75Z"
      fill="currentColor"
    />
  </svg>
);

export { ThumbDownOutline };
