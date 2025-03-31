import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const ChainweaverAlphaRoundedKdacolorLight = (
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
      d="M31.998 31.996v-5.998l5.195-3 5.197 3v5.998l-5.197 3.001zM21.606 31.997v-5.999l5.195-3 5.197 3v5.999l-5.197 3z"
    />
    <path
      fill="#4A9079"
      d="M26.805 34.994v-5.998l5.196-3 5.196 3v5.998l-5.196 3.001z"
    />
    <path
      fill="#4A9079"
      d="M26.802 40.995v-5.999l5.195-3 5.197 3v5.999l-5.197 3z"
    />
    <path
      fill="#0B1D2E"
      d="M11.218 44.001v-5.998l5.195-3 5.197 3V44l-5.196 3.001zM11.218 32v-5.998l5.195-3 5.197 3v5.999l-5.196 3z"
    />
    <path
      fill="#0B1D2E"
      d="M11.214 26.002v-6l5.195-2.998 5.197 2.999v5.999l-5.197 3zM26.804 16.998v-5.999L31.999 8l5.197 3v5.998l-5.197 3z"
    />
    <path
      fill="#0B1D2E"
      d="M16.414 23V17l5.195-3 5.197 3V23l-5.197 3zM21.609 50V44l5.195-3 5.197 3V50l-5.197 3z"
    />
    <path
      fill="#0B1D2E"
      d="M26.801 52.993v-5.998l5.195-3 5.197 3v5.998l-5.197 3.001zM37.195 22.997v-6L42.39 14l5.197 2.999v5.999l-5.197 3zM42.39 43.996v-5.998l5.195-3 5.197 3v5.998l-5.197 3.001z"
    />
    <path
      fill="#0B1D2E"
      d="M32 49.998V44l5.194-3 5.197 3v5.998L37.195 53zM42.39 31.996v-5.999l5.195-2.999 5.197 3v5.998l-5.197 3z"
    />
    <path
      fill="#0B1D2E"
      d="M42.389 25.996v-5.999l5.195-3 5.197 3v5.999l-5.197 3z"
    />
  </svg>
);
export default ChainweaverAlphaRoundedKdacolorLight;
