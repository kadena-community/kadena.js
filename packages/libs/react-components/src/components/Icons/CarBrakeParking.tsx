import * as React from 'react';
import { SVGProps } from 'react';
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={18}
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 0C7 0 3 4 3 9C3 14 7 18 12 18C17 18 21 14 21 9C21 4 17 0 12 0ZM12 16C8.1 16 5 12.9 5 9C5 5.1 8.1 2 12 2C15.9 2 19 5.1 19 9C19 12.9 15.9 16 12 16ZM20.5 17.5C22.7 15.3 24 12.3 24 9C24 5.7 22.7 2.7 20.5 0.5L19.4 1.6C21.3 3.5 22.5 6.1 22.5 9C22.5 11.9 21.3 14.5 19.4 16.4L20.5 17.5ZM4.6 16.4C2.7 14.5 1.5 11.9 1.5 9C1.5 6.1 2.7 3.5 4.6 1.6L3.5 0.5C1.3 2.7 0 5.7 0 9C0 12.3 1.3 15.3 3.5 17.5L4.6 16.4ZM9.5 4V14H11.5V10H13.5C14.0304 10 14.5391 9.78929 14.9142 9.41421C15.2893 9.03914 15.5 8.53043 15.5 8V6C15.5 5.46957 15.2893 4.96086 14.9142 4.58579C14.5391 4.21071 14.0304 4 13.5 4H9.5ZM11.5 6H13.5V8H11.5V6Z"
      fill="black"
    />
  </svg>
);
export default SVGComponent;
