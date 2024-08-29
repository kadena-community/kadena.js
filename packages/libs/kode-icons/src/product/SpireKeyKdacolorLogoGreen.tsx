import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SpireKeyKdacolorLogoGreen = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-style="kdacolor"
    viewBox="0 0 331 331"
    fill="none"
    fontSize="1.5em"
    width="331"
    height="331"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M143.23 0.752441L107.499 21.391L107.489 62.6477L143.23 83.2864L178.961 62.6477V21.391L143.23 0.752441Z" fill="#F5F5F5"/>
    <path d="M143.231 330.857L107.5 310.228V268.961L71.7693 289.59L36.0382 268.961V227.694L108.397 185.912L107.5 145.16L36.0279 185.912L0.296875 165.799V124.532L107.5 62.6368L143.231 83.2651L178.962 62.6368L286.166 124.532V165.799C286.166 165.799 249.754 186.778 250.095 186.603C250.435 186.427 178.962 145.707 178.962 145.707L179.859 185.912L250.435 227.694V268.961L214.704 289.353L178.973 268.961V310.228L143.242 330.857H143.231Z" fill="#4A9079"/>
  </svg>
);
export default SpireKeyKdacolorLogoGreen;
