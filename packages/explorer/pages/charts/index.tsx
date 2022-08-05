import React from 'react';
import { useWindowSize } from 'utils/window';

const ChartsPage = () => {
  const [_, height] = useWindowSize();

  return (
    <embed
      type="text/html"
      src="https://kadena.sexy/public/dashboard/f0513f15-8d0d-4e50-950f-35f6a72c0fe2?date_filter=past30days~#refresh=900"
      width="100%"
      height={`${height}px`}
    />
  );
};

export default ChartsPage;
