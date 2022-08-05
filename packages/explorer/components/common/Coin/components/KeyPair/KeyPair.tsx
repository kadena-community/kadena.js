import React, { FC } from 'react';
import s from './KeyPair.module.css';
import SubmitButton from '../SubmitButton/SubmitButton';

interface Props {
  onGenerateKey: () => void;
}

const KeyPair: FC<Props> = React.memo(props => {
  return (
    <div className={s.keyPairContainer}>
      <div className={s.container}>
        <p className={s.keyPair}>Generate KeyPair</p>
        <div className={s.keyLink}>
          Public and Private Keys will be generated and saved to files. Please
          grant the permissions to save multiple files at once.
        </div>
      </div>
      <SubmitButton onPress={props.onGenerateKey} title="Save to files" />
    </div>
  );
});

export default KeyPair;
