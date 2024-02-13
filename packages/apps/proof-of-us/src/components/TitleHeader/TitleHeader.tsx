import type { FC } from 'react';
import { headerClass, spacerClass } from './style.css';

interface IProps {
  label: string;
  Prepend?: React.ElementType;
  Append?: React.ElementType;
}

export const TitleHeader: FC<IProps> = ({ label, Prepend, Append }) => {
  return (
    <div className={headerClass}>
      {Prepend && <Prepend />}
      <h2>{label}</h2>
      <span className={spacerClass} />
      {Append && <Append />}
    </div>
  );
};
