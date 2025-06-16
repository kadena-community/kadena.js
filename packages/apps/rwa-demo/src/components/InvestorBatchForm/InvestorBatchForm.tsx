import { useBatchAddInvestors } from '@/hooks/batchAddInvestors';
import type { ICSVAccount } from '@/services/batchRegisterIdentity';
import { MonoCheckBox } from '@kadena/kode-icons';
import type { PressEvent } from '@kadena/kode-ui';
import { Button, Notification, Stack } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragNDropCSV } from '../DragNDropCSV/DragNDropCSV';

interface IProps {
  onClose?: () => void;
}

export interface IRegisterIdentityBatchProps {
  select: string[];
}

export const InvestorBatchForm: FC<IProps> = ({ onClose }) => {
  const [accounts, setAccounts] = useState<ICSVAccount[]>([]);
  const { submit } = useBatchAddInvestors();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const { handleSubmit } = useForm<IRegisterIdentityBatchProps>({
    defaultValues: {
      select: [],
    },
  });

  useEffect(() => {
    setIsRightAsideExpanded(true);
  }, []);

  const handleOnClose = () => {
    setIsRightAsideExpanded(false);
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

  const toggleSelectAll = (evt: PressEvent) => {
    const d = document.querySelectorAll('#investor-batch-form #select');
    const notSelected = [].filter.call(d, function (el: HTMLInputElement) {
      return el.checked === false;
    });

    const select = !notSelected.length;

    [].forEach.call(d, function (el: HTMLInputElement) {
      el.checked = !select;
    });
  };

  return (
    <>
      {isRightAsideExpanded && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Batch add investors" />
            <RightAsideContent>
              <Stack
                flexDirection="column"
                width="100%"
                gap="sm"
                id="investor-batch-form"
              >
                <Notification role="status" intent="info">
                  Drag and drop a CSV file with the following schema:
                  <pre>{JSON.stringify({ account: 'string' }, null, 2)}</pre>
                </Notification>
                <DragNDropCSV
                  onResult={handleResult}
                  resultSchema={{ account: 'string' }}
                />
                {accounts.length > 0 && (
                  <Stack width="100%" flexDirection="column" gap="sm">
                    <Stack>
                      <Button
                        onPress={toggleSelectAll}
                        startVisual={<MonoCheckBox />}
                        isCompact
                        variant="outlined"
                      >
                        Select all
                      </Button>
                    </Stack>
                    <CompactTable
                      variant="open"
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
                  </Stack>
                )}
              </Stack>
            </RightAsideContent>
            <RightAsideFooter>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button isDisabled={accounts.length === 0} type="submit">
                Add investors
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}
    </>
  );
};
