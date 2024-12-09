import { getInitials } from '@/utils/get-initials';
import { imgClass, initialsClass } from './select-profile.css';

const InitialsAvatar = ({
  name,
  accentColor,
  size,
}: {
  name: string;
  accentColor: string;
  size?: 'small' | 'medium' | 'large';
}) => {
  const initials = getInitials(name || 'default');

  return (
    <div
      className={imgClass}
      style={{
        backgroundColor: accentColor,
        ...(size === 'small'
          ? { width: 25, height: 25 }
          : { width: 40, height: 40 }),
      }}
    >
      <div
        className={initialsClass}
        style={{ backgroundColor: accentColor, fontSize: 12 }}
      >
        {initials}
      </div>
    </div>
  );
};

export default InitialsAvatar;
