import { useBatchAddInvestors } from '@/hooks/batchAddInvestors';
import type { ICSVAccount } from '@/services/batchRegisterIdentity';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragNDropCSV } from '../DragNDropCSV/DragNDropCSV';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
}

export interface IRegisterIdentityBatchProps {
  select: string[];
}

export const InvestorBatchForm: FC<IProps> = ({ onClose, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<ICSVAccount[]>([]);
  const { submit } = useBatchAddInvestors();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { handleSubmit } = useForm<IRegisterIdentityBatchProps>({
    defaultValues: {
      select: [],
    },
  });

  const handleOpen = () => {
    setIsRightAsideExpanded(true);
    setIsOpen(true);
    if (trigger.props.onPress) trigger.props.onPress();
  };

  const handleOnClose = () => {
    setIsRightAsideExpanded(false);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const onSubmit = async () => {
    const d = document.querySelectorAll('#select');

    const filled: string[] = [].filter
      .call(d, function (el: HTMLInputElement) {
        return el.checked;
      })
      .map((el: HTMLInputElement) => el.value);

    const data = accounts.filter(
      (account) => filled.indexOf(account.account) > -1,
    );

    await submit({ accounts: data });
    handleOnClose();
  };

  const handleResult = (accounts: ICSVAccount[]) => {
    setAccounts(accounts);
  };

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Batch add investors" />
            <RightAsideContent>
              <DragNDropCSV onResult={handleResult} />

              {accounts.length > 0 && (
                <CompactTable
                  fields={[
                    {
                      key: 'account',
                      label: '',
                      width: '20%',
                      render: CompactTableFormatters.FormatCheckbox({
                        name: 'select',
                      }),
                    },
                    {
                      key: 'account',
                      label: 'Account',
                      width: '40%',
                      render: CompactTableFormatters.FormatAccount(),
                    },
                    { key: 'alias', label: 'Alias', width: '40%' },
                  ]}
                  data={accounts}
                />
              )}
            </RightAsideContent>
            <RightAsideFooter>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button type="submit">Add investors</Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
