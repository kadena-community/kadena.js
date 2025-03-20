import { MonoCheck } from '@kadena/kode-icons/system';
import { imgClass, initialsClass } from './select-profile.css';

export const ChooseColor = ({
  accentColor,
  onClick,
  isActive,
}: {
  isActive: boolean;
  accentColor: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={imgClass}
      onClick={onClick}
      style={{
        backgroundColor: accentColor,
        cursor: 'pointer',
        width: 40,
        height: 40,
      }}
    >
      <div
        className={initialsClass}
        style={{ backgroundColor: accentColor, fontSize: 12 }}
      >
        {isActive && <MonoCheck />}
      </div>
    </div>
  );
};
