import type { FC } from 'react';
import { useEffect, useRef } from 'react';

export const Version: FC = () => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown';
    const commentStr = `
release sha: ${commitSha}                      
    `;

    const comment = document.createComment(commentStr);
    if (ref.current && ref.current.parentNode) {
      ref.current.parentNode.insertBefore(comment, ref.current);
    }
    localStorage.setItem('version', commitSha);
  }, []);
  return (
    <>
      <span ref={ref} />
    </>
  );
};
