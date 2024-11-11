import type { FC } from 'react';

export const KLogo: FC<{ height: number; className?: string }> = (props) => (
  <svg
    data-style="kdacolor"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_509_65640)">
      <path
        d="M28.4352 28L19.739 27.9956L8.89978 19.5354L13.3083 16L28.4352 28Z"
        fill="#4A9079"
      />
      <path
        d="M28.4352 4H19.7434L8.89978 12.4646L13.3083 16L28.4352 4Z"
        fill="#4A9079"
      />
      <path
        d="M8.89675 27.9957L3.5 23.7317V8.26851L8.89675 4.00452V27.9957Z"
        fill="#4A9079"
      />
    </g>
    <defs>
      <clipPath id="clip0_509_65640">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
