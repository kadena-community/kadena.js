import React, { FC } from 'react';
import s from './SubmitButton.module.css';

interface IProps {
  title: string;
  onPress?: () => void;
}

const SubmitButton: FC<IProps> = React.memo(({ onPress, title }) => {
  return (
    <div className={s.submitRow}>
      <button onClick={onPress} type="submit" className={s.submitRowBtn}>
        {title}
      </button>
    </div>
  );
});

export default SubmitButton;
