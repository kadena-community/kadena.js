import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoWAccount = (
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
    <path d="M3 6.56 6.328 18h2.144l1.408-6.128c.192-.832.368-2.032.368-2.032h.032s.208 1.2.4 2.032L12.072 18h2.16l3.264-11.44h-2.288l-1.44 5.664c-.224.992-.56 2.512-.56 2.512h-.032s-.288-1.44-.528-2.448L11.4 6.56H9.16l-1.248 5.744c-.24 1.008-.528 2.432-.528 2.432h-.032s-.272-1.52-.496-2.496L5.368 6.56zm15.5 3.94a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" />
  </svg>
);
export default MonoWAccount;
