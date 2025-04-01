import { Fungible } from '@/modules/account/account.repository';
import { Label } from '@/pages/transaction/components/helpers';
import { Select, SelectItem } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  withEvaluate: any;
  control: Control<ITransfer, any>;
  fungibles: Fungible[];
}

export const TransferCard: FC<IProps> = ({
  withEvaluate,
  control,
  fungibles,
}) => {
  return (
    <SectionCard background="none">
      <SectionCardContentBlock>
        <SectionCardHeader title="Transfer" />
        <SectionCardBody>
          <Controller
            name="fungible"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                // label="Token"
                aria-label="Asset"
                placeholder="Asset"
                startVisual={<Label>Asset:</Label>}
                size="sm"
                selectedKey={field.value}
                onSelectionChange={withEvaluate(field.onChange)}
                errorMessage={'Please select an asset'}
                isInvalid={!!error}
              >
                {fungibles.map((f) => (
                  <SelectItem key={f.contract}>{f.symbol}</SelectItem>
                ))}
              </Select>
            )}
          />
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
