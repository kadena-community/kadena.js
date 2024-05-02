import type { SVGProps } from 'react';
import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoSignatureNotAllowed = (
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
    <path d="M22 20v2H2v-2zM2.7 18l1.4-1.4L5.5 18l.7-.7-1.4-1.4 1.4-1.4-.7-.7-1.4 1.4-1.4-1.4-.7.7 1.4 1.4L2 17.3zM21.4 5.6 20 4.2l-13 13 1.4 1.4zm-9.6 5.6 1.5-1.5c-.4-.2-.8-.5-1-.7-.5-.4-.7-.9-.7-1.4 0-.8.7-1.6 2.1-2.2 1.4-.7 2.4-1 2.8-1l.6.3q.45.3.6.3t.6-.3c.2-.2.4-.4.4-.7 0-.6-.2-1.1-.5-1.3-.3-.3-.9-.4-1.6-.4q-1.65 0-4.5 1.8c-1.8 1.2-2.7 2.6-2.7 4.4 0 .7.3 1.3 1 1.9.3.1.8.4 1.4.8m4.8.1L15.1 13c.2.2.8.6 1 .8l1.7-1.6c-.3-.2-.9-.7-1.2-.9M19 15v-.4c0-.2 0-.4-.1-.6l-2.2.6c-.1.3-.1.5-.3.7l1.8 1.4c.5-.5.7-1.1.8-1.7m-5 1.3.4 2.2c.7-.1 1.4-.3 2-.6l-.9-2.1c-.4.3-.9.4-1.5.5m-2.5 2.6c.4 0 .7 0 1-.1l-.2-2.2c-.3 0-.6 0-1 .1z" />
  </svg>
);
export default MonoSignatureNotAllowed;
