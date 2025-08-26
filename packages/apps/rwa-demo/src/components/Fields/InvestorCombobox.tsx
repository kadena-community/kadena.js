import type { IForcedTransferTokensProps } from '@/services/forcedTransferTokens';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { MonoWallet } from '@kadena/kode-icons';
import {
  Combobox,
  ComboboxItem,
  maskValue,
  Stack,
  Text,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import type { Control, FieldError } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface IProps {
  control: Control<ITransferTokensProps | IForcedTransferTokensProps, any>;
  investorToAccount?: string;
  searchValue?: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  error?: FieldError | undefined;
  handleAccountChange?: (cb: any) => (value: any) => Promise<any>;
  investors: {
    accountName: string;
    alias: string;
  }[];
}

export const InvestorCombobox: FC<IProps> = ({
  control,
  investorToAccount,
  searchValue = '',
  setSearchValue,
  error,
  investors,
  handleAccountChange = (cb) => (value) => {},
}) => {
  return (
    <Controller
      name="investorToAccount"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <Combobox
          startVisual={<MonoWallet />}
          autoFocus
          placeholder={
            investorToAccount ? investorToAccount : 'Select an investor'
          }
          onInputChange={(e) => {
            setSearchValue(e);
          }}
          variant={error?.message ? 'negative' : 'default'}
          inputValue={searchValue}
          onSelectionChange={handleAccountChange(field.onChange)}
          errorMessage={error?.message}
          items={investors.filter(
            (item) =>
              item.alias.includes(searchValue) ||
              item.accountName.includes(searchValue),
          )}
        >
          {(item) => (
            <ComboboxItem key={item.accountName}>
              <Stack
                paddingBlock="sm"
                width="100%"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Text variant="code">{maskValue(`${item.accountName}`)}</Text>

                <Text size="smallest">{item.alias}</Text>
              </Stack>
            </ComboboxItem>
          )}
        </Combobox>
      )}
    />
  );
};
