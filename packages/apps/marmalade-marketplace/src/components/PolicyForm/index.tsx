import { Checkbox, CheckboxGroup } from '@kadena/kode-ui';
import React, { FC } from 'react';

interface PolicyFormProps {
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const PolicyForm: FC<PolicyFormProps> = ({ handleCheckboxChange }) => (
  <>
    <CheckboxGroup label="Available Concrete Policies" direction="column">
      <Checkbox
        id="nonUpdatableURI"
        onChange={(isSelected) =>
          handleCheckboxChange('nonUpdatableURI', isSelected)
        }
      >
        Non-Updatable URI
      </Checkbox>
      <Checkbox
        id="guarded"
        onChange={(isSelected) => handleCheckboxChange('guarded', isSelected)}
      >
        Guarded
      </Checkbox>
      <Checkbox
        id="nonFungible"
        onChange={(isSelected) =>
          handleCheckboxChange('nonFungible', isSelected)
        }
      >
        Non Fungible
      </Checkbox>
      <Checkbox
        id="hasRoyalty"
        onChange={(isSelected) =>
          handleCheckboxChange('hasRoyalty', isSelected)
        }
      >
        Has Royalty
      </Checkbox>
      <Checkbox
        id="collection"
        onChange={(isSelected) =>
          handleCheckboxChange('collection', isSelected)
        }
      >
        Collection
      </Checkbox>
    </CheckboxGroup>
  </>
);

export default PolicyForm;
