import React, { FC } from 'react';
import { TextField, Button, Checkbox } from '@kadena/react-ui';
import * as styles from '@/styles/create-token.css';


interface GuardFormProps {
  guardInput: { [key: string]: string };
  handleGuardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGuardExcludeChange: (name: string, checked: boolean) => void;
  excluded: string;
}

const GuardForm: FC<GuardFormProps> = ({ guardInput, handleGuardInputChange, handleGuardExcludeChange , excluded }) => (
  <div className={styles.formSection}>
    <TextField 
      label="URI Guard" 
      name="uriGuard" 
      value={guardInput.uriGuard} 
      disabled={guardInput.uriGuard === excluded}
      onChange={handleGuardInputChange} 
      endAddon={<Checkbox isSelected={guardInput.uriGuard === excluded} onChange={(e) => handleGuardExcludeChange('uriGuard', e)}>Exclude</Checkbox>}
    />
    <TextField 
      label="Mint Guard" 
      name="mintGuard" 
      value={guardInput.mintGuard} 
      disabled={guardInput.mintGuard === excluded}
      onChange={handleGuardInputChange} 
      endAddon={<Checkbox isSelected={guardInput.mintGuard === excluded} onChange={(e) => handleGuardExcludeChange('mintGuard', e)}>Exclude</Checkbox>}
    />
    <TextField 
      label="Burn Guard" 
      name="burnGuard" 
      value={guardInput.burnGuard} 
      disabled={guardInput.burnGuard === excluded}
      onChange={handleGuardInputChange} 
      endAddon={<Checkbox isSelected={guardInput.burnGuard === excluded} onChange={(e) => handleGuardExcludeChange('burnGuard', e)}>Exclude</Checkbox>}
    />
    <TextField 
      label="Sale Guard" 
      name="saleGuard" 
      value={guardInput.saleGuard} 
      disabled={guardInput.saleGuard === excluded}
      onChange={handleGuardInputChange} 
      endAddon={<Checkbox isSelected={guardInput.saleGuard === excluded} onChange={(e) => handleGuardExcludeChange('saleGuard', e)}>Exclude</Checkbox>}
    />
    <TextField 
      label="Transfer Guard" 
      name="transferGuard" 
      value={guardInput.transferGuard} 
      disabled={guardInput.transferGuard === excluded}
      onChange={handleGuardInputChange} 
      endAddon={<Checkbox isSelected={guardInput.transferGuard === excluded} onChange={(e) => handleGuardExcludeChange('transferGuard', e.target.checked)}>Exclude</Checkbox>}
    />
  </div>
);

export default GuardForm;