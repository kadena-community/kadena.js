import type { FC } from 'react';
import { useEffect, useRef } from 'react';

export const Version: FC = () => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown';
    const SSRTime = process.env.NEXT_PUBLIC_BUILD_TIME || '';
    const commentStr = `-----<{{@ release sha: ${commitSha} @}}>-----`;
    const commentStr2 = `-----<{{@ repo: https://github.com ${process.env.NEXT_PUBLIC_GIT_REPO_SLUG || ''} ${process.env.NEXT_PUBLIC_GIT_COMMIT_REF || ''} @}}>-----`;
    const commentStr3 = `-----<{{@ ${SSRTime} @}}>-----`;

    const comment = document.createComment(commentStr);
    const comment2 = document.createComment(commentStr2);
    const comment3 = document.createComment(commentStr3);
    if (ref.current && ref.current.parentNode) {
      ref.current.innerHTML = '';
      ref.current.appendChild(comment);
      ref.current.appendChild(comment2);
      ref.current.appendChild(comment3);
    }
    localStorage.setItem('version', commitSha);
    localStorage.setItem('versionDate', SSRTime);
  }, []);
  return (
    <>
      <span ref={ref} />
    </>
  );
};
