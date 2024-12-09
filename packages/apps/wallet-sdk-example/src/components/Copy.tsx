import { useState } from 'react';

export const CopyToClipboard = ({ value }: { value: string }) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  return (
    <button
      className={'transition-all text-white rounded-sm m-0 p-0 outline-none'}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setHasCopied(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setHasCopied(false);
      }}
    >
      <svg
        id="Copy_to_Clipboard_24"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect width="24" height="24" stroke="none" fill="#000000" opacity="0" />
        {hasCopied === false ? (
          <g transform="matrix(0.42 0 0 0.42 12 12)">
            <path
              style={{
                stroke: 'none',
                strokeWidth: 1,
                strokeDasharray: 'none',
                strokeLinecap: 'butt',
                strokeDashoffset: 0,
                strokeLinejoin: 'miter',
                strokeMiterlimit: 4,
                fill: 'rgb(0,0,0)',
                fillRule: 'nonzero',
                opacity: 1,
              }}
              transform="translate(-25, -24)"
              d="M 15 0 C 13.90625 0 13 0.90625 13 2 L 6 2 C 4.355469 2 3 3.355469 3 5 L 3 41 C 3 42.644531 4.355469 44 6 44 L 36 44 C 37.644531 44 39 42.644531 39 41 L 39 5 C 39 3.355469 37.644531 2 36 2 L 29 2 C 29 0.90625 28.09375 0 27 0 Z M 15 2 L 27 2 L 27 5 C 27 5.566406 26.566406 6 26 6 L 16 6 C 15.433594 6 15 5.566406 15 5 Z M 6 4 L 13 4 L 13 5 C 13 6.644531 14.355469 8 16 8 L 26 8 C 27.644531 8 29 6.644531 29 5 L 29 4 L 36 4 C 36.554688 4 37 4.445313 37 5 L 37 41 C 37 41.554688 36.554688 42 36 42 L 6 42 C 5.445313 42 5 41.554688 5 41 L 5 5 C 5 4.445313 5.445313 4 6 4 Z M 21 14 L 21 16 L 23 16 L 23 14 Z M 25 14 L 25 16 L 27 16 L 27 14 Z M 29 14 L 29 16 L 31 16 L 31 14 Z M 33 14 L 33 16 L 35 16 L 35 14 Z M 41 14 L 41 16 L 43 16 L 43 14 Z M 45 14 L 45 16 L 47 16 L 47 14 Z M 21 18 L 21 20 L 23 20 L 23 18 Z M 45 18 L 45 20 L 47 20 L 47 18 Z M 21 22 L 21 24 L 23 24 L 23 22 Z M 45 22 L 45 24 L 47 24 L 47 22 Z M 21 26 L 21 28 L 23 28 L 23 26 Z M 45 26 L 45 28 L 47 28 L 47 26 Z M 21 30 L 21 32 L 23 32 L 23 30 Z M 45 30 L 45 32 L 47 32 L 47 30 Z M 21 34 L 21 36 L 23 36 L 23 34 Z M 45 34 L 45 36 L 47 36 L 47 34 Z M 21 38 L 21 40 L 23 40 L 23 38 Z M 45 38 L 45 40 L 47 40 L 47 38 Z M 45 42 L 45 44 L 47 44 L 47 42 Z M 21 46 L 21 48 L 23 48 L 23 46 Z M 25 46 L 25 48 L 27 48 L 27 46 Z M 29 46 L 29 48 L 31 48 L 31 46 Z M 33 46 L 33 48 L 35 48 L 35 46 Z M 37 46 L 37 48 L 39 48 L 39 46 Z M 41 46 L 41 48 L 43 48 L 43 46 Z M 45 46 L 45 48 L 47 48 L 47 46 Z"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g transform="matrix(0.52 0 0 0.52 12 12)">
            <path
              style={{
                stroke: 'none',
                strokeWidth: 1,
                strokeDasharray: 'none',
                strokeLinecap: 'butt',
                strokeDashoffset: 0,
                strokeLinejoin: 'miter',
                strokeMiterlimit: 4,
                fill: 'rgb(0,0,0)',
                fillRule: 'nonzero',
                opacity: 1,
              }}
              transform=" translate(-24.95, -25.98)"
              d="M 42.875 8.625 C 42.84375 8.632813 42.8125 8.644531 42.78125 8.65625 C 42.519531 8.722656 42.292969 8.890625 42.15625 9.125 L 21.71875 40.8125 L 7.65625 28.125 C 7.410156 27.8125 7 27.675781 6.613281 27.777344 C 6.226563 27.878906 5.941406 28.203125 5.882813 28.597656 C 5.824219 28.992188 6.003906 29.382813 6.34375 29.59375 L 21.25 43.09375 C 21.46875 43.285156 21.761719 43.371094 22.050781 43.328125 C 22.339844 43.285156 22.59375 43.121094 22.75 42.875 L 43.84375 10.1875 C 44.074219 9.859375 44.085938 9.425781 43.875 9.085938 C 43.664063 8.746094 43.269531 8.566406 42.875 8.625 Z"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </button>
  );
};
