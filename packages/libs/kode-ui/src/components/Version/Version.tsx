import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  repo: string;
  sha?: string;
  SSRTime?: string;
}

export const Version: FC<IProps> = ({ repo, sha = 'unknown', SSRTime }) => {
  useEffect(() => {
    const commentStr = `-----<{{@ release sha: ${sha} @}}>------->
${repo}
<-------<{{@ ${SSRTime || '-'} @}}>-----`;

    const comment = document.createComment(commentStr);

    const body = document.querySelector('body');
    body?.prepend(comment);

    localStorage.setItem('version', sha);
    localStorage.setItem('versionDate', SSRTime ?? '');
  }, []);
  return null;
};
