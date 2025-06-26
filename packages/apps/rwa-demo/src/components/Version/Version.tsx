import type { FC } from 'react';
import { useEffect, useRef } from 'react';

export const Version: FC = () => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const commentStr = `
release sha: ${process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown'}                      
    `;

    const comment = document.createComment(commentStr);
    if (ref.current && ref.current.parentNode) {
      ref.current.parentNode.insertBefore(comment, ref.current);
    }
  }, []);
  return (
    <>
      <span ref={ref} />
    </>
  );
};
