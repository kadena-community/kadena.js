import type { FC } from 'react';
import React from 'react';

const LoadingIcon: FC<{ className: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      data-style="animated"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <defs>
        <style>
          {`
      .package {
        animation: packageAnimation 2s infinite;
      }

      .arrows {
        animation: arrowAnimation 2s infinite;
      }

      @keyframes arrowAnimation {
        0% {
          transform-origin: 12px 12px;
          transform: scale(1.2);
          opacity: 1;
        }
        50% {
          transform-origin: 12px 12px;
          transform: scale(1);
          opacity: 0.5;
        }
        100% {
          transform-origin: 12px 12px;
          transform: scale(1.2);
          opacity: 1;
        }
      }

      @keyframes packageAnimation {
        0% {
          opacity: 0.2;
          transform: translateX(48px)
        }
        50% {
          opacity: 1;
          transform: translateX(0px)
        }
        100% {
          opacity: 0.2;
          transform: translateX(-48px)
        }
      }
      `}
        </style>
      </defs>
      <path
        className="package"
        d="M18.25 7.60005L12.75 4.42005C12.5223 4.28741 12.2635 4.21753 12 4.21753C11.7365 4.21753 11.4777 4.28741 11.25 4.42005L5.75 7.60005C5.29 7.87005 5 8.36005 5 8.90005V15.2501C5 15.7901 5.29 16.2801 5.75 16.5501L11.25 19.7301C11.71 20.0001 12.29 20.0001 12.75 19.7301L18.25 16.5501C18.71 16.2801 19 15.7901 19 15.2501V8.90005C19 8.36005 18.71 7.87005 18.25 7.60005ZM7 14.9601V10.3401L11 12.6601V17.2701L7 14.9601ZM12 10.9301L8 8.61005L12 6.30005L16 8.61005L12 10.9301ZM13 17.2701V12.6601L17 10.3401V14.9601L13 17.2701Z"
        fill="currentColor"
      />
      <path
        className="arrows"
        d="M7 2H3.5C2.67 2 2 2.67 2 3.5V7H4V4H7V2ZM17 2H20.5C21.33 2 22 2.67 22 3.5V7H20V4H17V2ZM7 22H3.5C2.67 22 2 21.33 2 20.5V17H4V20H7V22ZM17 22H20.5C21.33 22 22 21.33 22 20.5V17H20V20H17V22Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LoadingIcon;
