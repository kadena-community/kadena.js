import { getInitials } from '@/utils/get-initials';
import { imgClass, initialsClass } from './select-profile.css';

const InitialsAvatar = ({
  name,
  accentColor,
}: {
  name: string;
  accentColor: string;
}) => {
  const initials = getInitials(name || 'default');

  return (
    <div className={imgClass} style={{ backgroundColor: accentColor }}>
      <div className={initialsClass} style={{ backgroundColor: accentColor }}>
        {initials}
      </div>
    </div>
  );
};

export default InitialsAvatar;
