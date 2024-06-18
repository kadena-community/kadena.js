import React, { FC } from 'react';
import { TextField } from '@kadena/react-ui';
import * as styles from '@/styles/create-token.css';

interface GuardFormProps {
  guardInput: { [key: string]: string };
  handleGuardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GuardForm: FC<GuardFormProps> = ({ guardInput, handleGuardInputChange }) => (
  <div className={styles.formSection}>
    <TextField label="URI Guard" name="uriGuard" value={guardInput.uriGuard} onChange={handleGuardInputChange} />
    <TextField label="Mint Guard" name="mintGuard" value={guardInput.mintGuard} onChange={handleGuardInputChange} />
    <TextField label="Burn Guard" name="burnGuard" value={guardInput.burnGuard} onChange={handleGuardInputChange} />
    <TextField label="Sale Guard" name="saleGuard" value={guardInput.saleGuard} onChange={handleGuardInputChange} />
    <TextField label="Transfer Guard" name="transferGuard" value={guardInput.transferGuard} onChange={handleGuardInputChange} />
  </div>
);

export default GuardForm;