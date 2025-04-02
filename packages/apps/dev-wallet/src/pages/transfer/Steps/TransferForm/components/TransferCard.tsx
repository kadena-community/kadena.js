import { Fungible } from '@/modules/account/account.repository';
import { wrapperClass } from '@/pages/errors/styles.css';
import { Label } from '@/pages/transaction/components/helpers';
import { MonoSwipeRightAlt } from '@kadena/kode-icons/system';
import { Card, Select, SelectItem, Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
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
    <Card fullWidth>
      <CardContentBlock
        title="Transfer"
        visual={<MonoSwipeRightAlt width={36} height={36} />}
      >
        <Stack
          flexDirection="column"
          gap="xxl"
          marginBlockEnd="xxxl"
          className={wrapperClass}
        >
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
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
