import React from 'react';
export const LoaderIcon = ({ ...props }) => {
  return (
    <svg
      data-style="animated"
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      fill="none"
      viewBox="20 20 40 40"
      style={{
        animation: 'rotate 2s linear infinite',
        transformOrigin: 'center center',
      }}
      {...props}
    >
      <defs>
        <style>
          {
            '\n      .loader-path {\n        stroke-dasharray: 150,200;\n        stroke-dashoffset: -10;\n        animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;\n        stroke-linecap: round;\n      }\n\n      @-webkit-keyframes rotate { 100% { transform: rotate(360deg); } }\n      @keyframes rotate { 100% { transform: rotate(360deg); } }\n      @-webkit-keyframes dash { 0% { stroke-dasharray: 1,200; stroke-dashoffset: 0; } 50% { stroke-dasharray: 89,200; stroke-dashoffset: -35; } 100% { stroke-dasharray: 89,200; stroke-dashoffset: -124; } }\n      @keyframes dash { 0% { stroke-dasharray: 1,200; stroke-dashoffset: 0; } 50% { stroke-dasharray: 89,200; stroke-dashoffset: -35; } 100% { stroke-dasharray: 89,200; stroke-dashoffset: -124; } }\n      @-webkit-keyframes color { 0% { stroke: currentColor; } 40% { stroke: currentColor; } 66% { stroke: currentColor; } 80%, 90% { stroke: currentColor; } }\n      @keyframes color { 0% { stroke: currentColor; } 40% { stroke: currentColor; } 66% { stroke: currentColor; } 80%, 90% { stroke: currentColor; } }\n\n    '
          }
        </style>
      </defs>
      <circle
        className="loader-path"
        cx={40}
        cy={40}
        r={19}
        fill="none"
        strokeWidth={2}
      />
    </svg>
  );
};
