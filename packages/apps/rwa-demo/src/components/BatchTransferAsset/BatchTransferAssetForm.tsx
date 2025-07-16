import { useAsset } from '@/hooks/asset';
import { useBatchTransferTokens } from '@/hooks/batchTransferTokens';
import type {
  IBatchTransferTokensProps,
  ITransferToken,
} from '@/services/batchTransferTokens';
import { MonoCheckBox } from '@kadena/kode-icons';
import type { PressEvent } from '@kadena/kode-ui';
import { Badge, Button, Notification, Stack } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragNDropCSV } from '../DragNDropCSV/DragNDropCSV';
import { selectBoxClass } from './styles.css';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
}

export interface IRegisterIdentityBatchProps {
  select: string[];
}

export const BatchTransferAssetForm: FC<IProps> = ({ onClose, trigger }) => {
  const [data, setData] = useState<ITransferToken[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const { submit } = useBatchTransferTokens();
  const { investors } = useAsset();
  const {
    handleSubmit,
    formState: { isValid },
  } = useForm<IBatchTransferTokensProps>({
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

    const newData = data.filter((d) => filled.indexOf(d.to) > -1);

    const tx = await submit(newData);

    if (!tx) return;
    handleOnClose();
  };

  const handleResult = (data: ITransferToken[]) => {
    setData(data);
  };

  const toggleSelectAll = (evt: PressEvent) => {
    const d = document.querySelectorAll('#select');
    const notSelected = [].filter.call(d, function (el: HTMLInputElement) {
      if (el.disabled) return false;
      return el.checked === false;
    });

    const select = !notSelected.length;

    [].forEach.call(d, function (el: HTMLInputElement) {
      if (el.disabled) return false;
      el.checked = !select;
    });
  };

  const investorsAccounts = investors.map((v) => v.accountName);

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <RightAsideHeader label="Batch transfer tokens" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RightAsideContent>
              <Stack flexDirection="column" width="100%" gap="sm">
                <Notification role="status" intent="info">
                  Drag and drop a CSV file with the following schema:
                  <pre>
                    {JSON.stringify(
                      { to: 'string', amount: 'number' },
                      null,
                      2,
                    )}
                  </pre>
                </Notification>
                <DragNDropCSV
                  onResult={handleResult}
                  resultSchema={{ to: 'string', amount: 'number' }}
                />

                {data.length > 0 && (
                  <Stack width="100%" flexDirection="column" gap="sm">
                    <Stack>
                      <Button
                        aria-label="Select all accounts"
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
                          key: 'to',
                          label: '',
                          width: '20%',
                          render: ({ value }: { value: string }) => {
                            const isDisabled = !investorsAccounts.includes(
                              `${value}`.trim(),
                            );

                            return (
                              <input
                                className={selectBoxClass}
                                disabled={isDisabled}
                                type="checkbox"
                                name="select"
                                data-value={value}
                                id="select"
                                value={value}
                              />
                            );
                          },
                        },
                        {
                          key: 'to',
                          label: 'To',
                          width: '30%',
                          render: CompactTableFormatters.FormatAccount(),
                        },
                        {
                          key: 'amount',
                          label: 'Amount',
                          width: '30%',
                          align: 'end',
                          render: CompactTableFormatters.FormatAmount(),
                        },
                        {
                          key: 'to',
                          label: 'Verified',
                          width: '20%',
                          render: ({ value }: { value: string }) => {
                            const isDisabled = !investorsAccounts.includes(
                              `${value}`.trim(),
                            );

                            if (!isDisabled) return null;
                            return (
                              <Badge size="sm" style="negative">
                                no investor
                              </Badge>
                            );
                          },
                        },
                      ]}
                      data={data}
                    />
                  </Stack>
                )}
              </Stack>
            </RightAsideContent>
            <RightAsideFooter>
              <Button variant="outlined" onPress={() => handleOnClose()}>
                Cancel
              </Button>

              <Button isDisabled={!isValid} variant="primary" type="submit">
                Transfer
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
