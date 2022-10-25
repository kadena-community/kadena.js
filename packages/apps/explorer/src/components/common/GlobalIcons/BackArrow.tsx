import { useRouter } from 'next/router';
import React, { FC } from 'react';

const BackArrow: FC = () => {
  const router = useRouter();

  return (
    <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
      <svg
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.41424 10L10.7071 16.2929L9.29292 17.7071L0.585815 9.00001L9.29292 0.292908L10.7071 1.70712L4.41424 8.00001H19V10H4.41424Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default BackArrow;
