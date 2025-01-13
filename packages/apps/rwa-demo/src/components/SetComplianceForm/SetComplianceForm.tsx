import { INFINITE_COMPLIANCE } from '@/constants';
import { useAsset } from '@/hooks/asset';
import { useSetCompliance } from '@/hooks/setCompliance';
import type { ISetComplianceParametersProps } from '@/services/setComplianceParameters';
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
  const { submit, isAllowed } = useSetCompliance();
  const { asset } = useAsset();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [isOpen, setIsOpen] = useState(false);
  const {
    handleSubmit,
    reset,
    control,
    formState: { isValid },
  } = useForm<ISetComplianceParametersProps>({
    defaultValues: {
      maxBalance: `${asset?.maxBalance.value ?? 0}`,
      maxSupply: `${asset?.maxSupply.value ?? 0}`,
      maxInvestors: `${asset?.maxInvestors.value ?? 0}`,
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

  const onSubmit = async (data: ISetComplianceParametersProps) => {
    await submit(data);

    handleOnClose();
  };

  useEffect(() => {
    reset({
      maxSupply: `${asset?.maxSupply.value}`,
      maxBalance: `${asset?.maxBalance.value}`,
      maxInvestors: `${asset?.maxInvestors.value}`,
    });
  }, [
    asset?.maxBalance.value,
    asset?.maxSupply.value,
    asset?.maxInvestors.value,
  ]);

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
                rules={{ required: true, min: INFINITE_COMPLIANCE }}
                render={({ field }) => (
                  <TextField type="number" label="Max Balance" {...field} />
                )}
              />

              <Controller
                name="maxSupply"
                control={control}
                rules={{ required: true, min: INFINITE_COMPLIANCE }}
                render={({ field }) => (
                  <TextField type="number" label="Max Supply" {...field} />
                )}
              />
              <Controller
                name="maxInvestors"
                control={control}
                rules={{ required: true, min: INFINITE_COMPLIANCE }}
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
              <Button isDisabled={!isAllowed || !isValid} type="submit">
                Set Compliance
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
