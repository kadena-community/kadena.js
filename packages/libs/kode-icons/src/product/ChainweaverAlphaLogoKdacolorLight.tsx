import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const ChainweaverAlphaLogoKdacolorLight = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-style="kdacolor"
    viewBox="0 0 64 64"
    fontSize="1.5em"
    fill="currentColor"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#4A9079"
      d="M31.997 31.995v-7.998l6.927-4 6.929 4v7.998l-6.929 4.001z"
    />
    <path
      fill="#4A9079"
      d="M18.141 31.996v-7.998l6.927-4 6.93 4v7.998l-6.93 4z"
    />
    <path
      fill="#4A9079"
      d="M25.074 35.993v-7.999l6.927-3.999 6.929 4v7.997L32 39.995z"
    />
    <path
      fill="#4A9079"
      d="M25.07 43.993v-7.998l6.926-4 6.93 4v7.998l-6.93 4z"
    />
    <path
      fill="#0B1D2E"
      d="M4.291 48.002v-7.998l6.927-4 6.929 4v7.998l-6.929 4zM4.291 32.001v-7.998l6.927-4 6.929 4v7.998l-6.929 4.001z"
    />
    <path
      fill="#0B1D2E"
      d="M4.285 24.002v-7.998l6.927-4 6.93 4v7.998l-6.93 4.001zM25.072 11.997V4L31.999 0l6.929 4v7.997l-6.929 4.001z"
    />
    <path
      fill="#0B1D2E"
      d="M11.218 20v-7.998l6.927-4 6.929 4V20l-6.929 4zM18.145 56v-7.998l6.927-4 6.929 4V56l-6.929 4z"
    />
    <path
      fill="#0B1D2E"
      d="M25.068 59.991v-7.998l6.927-4 6.93 4v7.998l-6.93 4.001zM38.926 19.995v-7.998l6.927-3.999 6.929 4v7.997l-6.929 4.002zM45.853 47.995v-7.998l6.927-3.999 6.929 4v7.997l-6.929 4.001z"
    />
    <path
      fill="#0B1D2E"
      d="M31.999 55.998V48l6.927-4 6.929 4v7.998l-6.929 4zM45.853 31.995v-7.998l6.927-4 6.929 4v7.998l-6.929 4z"
    />
    <path
      fill="#0B1D2E"
      d="M45.852 23.994v-7.998l6.927-3.999 6.929 4v7.997l-6.929 4.002z"
    />
  </svg>
);
export default ChainweaverAlphaLogoKdacolorLight;
