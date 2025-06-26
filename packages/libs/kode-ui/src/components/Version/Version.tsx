import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';

interface IProps {
  repo: string;
  sha?: string;
  SSRTime?: string;
}

export const Version: FC<IProps> = ({ repo, sha = 'unknown', SSRTime }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const commentStr = `-----<{{@ release sha: ${sha} @}}>------->
${repo}
<-------<{{@ ${SSRTime || '-'} @}}>-----`;

    const comment = document.createComment(commentStr);
    if (ref.current && ref.current.parentNode) {
      ref.current.innerHTML = '';
      ref.current.appendChild(comment);
    }
    localStorage.setItem('version', sha);
    localStorage.setItem('versionDate', SSRTime ?? '');
  }, []);
  return <span ref={ref} />;
};
