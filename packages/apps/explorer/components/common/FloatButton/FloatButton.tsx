import React, { FC, memo, useState } from 'react';
import Link from 'next/link';
import QuestionIcon from '../GlobalIcons/QuestionIcon';
import DiscordIcon from '../GlobalIcons/DiscordIcon';

import s from './FloatButton.module.css';

const FloatButton: FC = () => {
  const [state, setState] = useState<boolean>(false);

  return (
    <>
      {state && (
        <Link href="https://discord.com/invite/bsUcWmX">
          <a target="_blank" className={s.discord}>
            <DiscordIcon height="24" width="24" fill="#fff" />
          </a>
        </Link>
      )}
      <div
        className={s.floatButton}
        style={state ? { opacity: 1 } : {}}
        onClick={() => {
          setState(!state);
        }}>
        <QuestionIcon height="24" width="24" fill="#fff" />
      </div>
    </>
  );
};

export default memo(FloatButton);
