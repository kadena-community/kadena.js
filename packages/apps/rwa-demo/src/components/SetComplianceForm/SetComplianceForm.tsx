import { useAsset } from '@/hooks/asset';
import { useSetCompliance } from '@/hooks/setCompliance';
import type { ISetComplianceProps } from '@/services/setCompliance';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
}

export const SetComplianceForm: FC<IProps> = ({ onClose, trigger }) => {
  const { submit } = useSetCompliance();
  const { asset } = useAsset();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [isOpen, setIsOpen] = useState(false);
  const { handleSubmit, reset, control } = useForm<ISetComplianceProps>({
    defaultValues: {
      maxBalance: `${asset?.maxBalance ?? 0}`,
      maxSupply: `${asset?.maxSupply ?? 0}`,
      maxInvestors: `${asset?.maxInvestors ?? 0}`,
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

  const onSubmit = async (data: ISetComplianceProps) => {
    await submit(data);

    handleOnClose();
  };

  useEffect(() => {
    reset({
      maxSupply: `${asset?.maxSupply}`,
      maxBalance: `${asset?.maxBalance}`,
      maxInvestors: `${asset?.maxInvestors}`,
    });
  }, [asset?.maxBalance, asset?.maxSupply, asset?.maxInvestors]);

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Set Compliance" />
            <RightAsideContent>
              <Controller
                name="maxBalance"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField type="number" label="Max Balance" {...field} />
                )}
              />

              <Controller
                name="maxSupply"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField type="number" label="Max Supply" {...field} />
                )}
              />
              <Controller
                name="maxInvestors"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    label="Max Investors Count"
                    {...field}
                  />
                )}
              />
            </RightAsideContent>
            <RightAsideFooter>
              <Button onPress={onClose} variant="transparent">
                Cancel
              </Button>
              <Button type="submit">Set Compliance</Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
