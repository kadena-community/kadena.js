import React, { FC } from 'react';
import { TextField, Button, Checkbox } from '@kadena/kode-ui';
import * as styles from '@/styles/create-token.css';
import CrudCard from '@/components/CrudCard';


interface GuardFormProps {
  guardInput: { [key: string]: string };
  handleGuardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGuardExcludeChange: (name: string, checked: boolean) => void;
  excluded: string;
}

const GuardForm: FC<GuardFormProps> = ({ guardInput, handleGuardInputChange, handleGuardExcludeChange , excluded }) => (
  <CrudCard
    title="Guard"
    description={[
      "Provide Guards for the token",
    ]}>
    <TextField
      label="URI Guard"
      name="uriGuard"
      value={guardInput.uriGuard}
      disabled
      endAddon={<Checkbox isSelected={guardInput.uriGuard === excluded} onChange={(e) => handleGuardExcludeChange('uriGuard', e)}>Exclude</Checkbox>}
    />
    <TextField
      label="Mint Guard"
      name="mintGuard"
      value={guardInput.mintGuard}
      disabled
      endAddon={<Checkbox isSelected={guardInput.mintGuard === excluded} onChange={(e) => handleGuardExcludeChange('mintGuard', e)}>Exclude</Checkbox>}
    />
    <TextField
      label="Burn Guard"
      name="burnGuard"
      value={guardInput.burnGuard}
      disabled
      endAddon={<Checkbox isSelected={guardInput.burnGuard === excluded} onChange={(e) => handleGuardExcludeChange('burnGuard', e)}>Exclude</Checkbox>}
    />
    <TextField
      label="Sale Guard"
      name="saleGuard"
      value={guardInput.saleGuard}
      disabled
      endAddon={<Checkbox isSelected={guardInput.saleGuard === excluded} onChange={(e) => handleGuardExcludeChange('saleGuard', e)}>Exclude</Checkbox>}
    />
    <TextField
      label="Transfer Guard"
      name="transferGuard"
      value={guardInput.transferGuard}
      disabled
      endAddon={<Checkbox isSelected={guardInput.transferGuard === excluded} onChange={(e) => handleGuardExcludeChange('transferGuard', e)}>Exclude</Checkbox>}
    />
  </CrudCard>
);

export default GuardForm;
