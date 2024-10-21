import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoBluetoothAudio = (
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
    <path d="m14.24 12.01 2.32 2.32c.28-.72.44-1.51.44-2.33s-.16-1.59-.43-2.31zm5.29-5.3-1.26 1.26c.63 1.21.98 2.57.98 4.02s-.36 2.82-.98 4.02l1.2 1.2a9.94 9.94 0 0 0 1.54-5.31c-.01-1.89-.55-3.67-1.48-5.19m-3.82 1L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29zM11 5.83l1.88 1.88L11 9.59zm1.88 10.46L11 18.17v-3.76z" />
  </svg>
);
export default MonoBluetoothAudio;
