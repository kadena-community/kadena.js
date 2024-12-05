import { useState } from 'react';

export const useShow = (initial: boolean = true) => {
  const [show, setShow] = useState(initial);
  return [
    show,
    setShow,
    ({ children }: { children: React.ReactNode }) => (show ? children : null),
  ] as const;
};
