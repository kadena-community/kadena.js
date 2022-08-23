import React, { FC, memo } from 'react';
import s from './CommandPact.module.css';
import Hint from '../../../Hint/Hint';
import Pact from './components/Pact';

interface IProps {
  pactCode: string;
  onPactCodeChange: (val: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CommandPact: FC<IProps> = ({ pactCode, onPactCodeChange }) => {
  return (
    <div className={`${s.PactContainer} ${s.pactContainer}`}>
      <div className={s.pactHead}>
        Pact Code
        <Hint messageKey="pact" id="pact" />
      </div>
      <Pact pactCode={pactCode} onPactCodeChange={onPactCodeChange} />
    </div>
  );
};

export default memo(CommandPact);
