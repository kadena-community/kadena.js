import React, { FC, memo } from 'react';
import s from './Pact.module.css';

interface IProps {
  pactCode: string;
  onPactCodeChange: (val: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Pact: FC<IProps> = ({ pactCode, onPactCodeChange }) => {
  return (
    <div>
      <div className={s.textareaContainer}>
        <textarea
          className={s.pactText}
          spellCheck={false}
          name={pactCode}
          value={pactCode}
          onChange={onPactCodeChange}
          placeholder={`;;coin contract examples: 
(coin.details "nick-cage") 
(coin.transfer "from" "to" 12.4) 
(coin.transfer-create "from" "to" (read-keyset "to-ks") 4.2) 
(coin.create-account "my-new-acct" (read-keyset "my-new-ks")) 
;;arbitrary contract calls: 
(free.my-contract-name.foo "param-one" "param-two") 
(user.my-contract-name.bar [list, of, stuff] 1.0)`}
        />
      </div>
      <div className={s.pactLink}>
        Pact is Kadena’s smart contract programming language. Type arbitrary
        pact expressions in the input box above. For more help look at
        <a target="_blank" href="https://kadena.io/" className={s.link}>
          our docs.
        </a>
      </div>
    </div>
  );
};

export default memo(Pact);
