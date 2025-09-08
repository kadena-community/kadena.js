import { useAsset } from '@/hooks/asset';
import { useSetCompliance } from '@/hooks/setCompliance';
import type { ISetComplianceParametersProps } from '@/services/setComplianceParameters';
import { setComplianceValue } from '@/utils/setComplianceValue';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement<{ onPress: () => void }>;
}

export const SetComplianceForm: FC<IProps> = ({ onClose, trigger }) => {
  const { submit, isAllowed } = useSetCompliance();
  const { asset } = useAsset();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const [isOpen, setIsOpen] = useState(false);
  const {
    handleSubmit,
    reset,
    control,
    formState: { isValid, errors },
  } = useForm<ISetComplianceParametersProps>({
    mode: 'onChange',
    defaultValues: {
      maxBalance: `${setComplianceValue(asset?.compliance.maxBalance.value)}`,
      maxSupply: `${setComplianceValue(asset?.compliance.maxSupply.value)}`,
      maxInvestors: `${setComplianceValue(asset?.compliance.maxInvestors.value)}`,
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
    const newData = {
      maxSupply: setComplianceValue(data.maxSupply, -1),
      maxBalance: setComplianceValue(data.maxBalance, -1),
      maxInvestors: setComplianceValue(data.maxInvestors, -1),
    };

    await submit(newData);

    handleOnClose();
  };

  useEffect(() => {
    reset({
      maxSupply: `${setComplianceValue(asset?.compliance.maxSupply.value)}`,
      maxBalance: `${setComplianceValue(asset?.compliance.maxBalance.value)}`,
      maxInvestors: `${setComplianceValue(asset?.compliance.maxInvestors.value)}`,
    });
  }, [
    asset?.compliance.maxBalance.value,
    asset?.compliance.maxSupply.value,
    asset?.compliance.maxInvestors.value,
  ]);

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Set Compliance" />
            <RightAsideContent>
              <Stack flexDirection="column" gap="md">
                <Controller
                  name="maxBalance"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Max Balance must be a non-negative number',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      label="Max Balance"
                      {...field}
                      isInvalid={!!errors.maxBalance?.message}
                      errorMessage={errors.maxBalance?.message}
                    />
                  )}
                />

                <Controller
                  name="maxSupply"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Max supply must be a non-negative number',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      label="Max Supply"
                      {...field}
                      isInvalid={!!errors.maxSupply?.message}
                      errorMessage={errors.maxSupply?.message}
                    />
                  )}
                />
                <Controller
                  name="maxInvestors"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Max investors must be a non-negative number',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      label="Max Investors Count"
                      {...field}
                      isInvalid={!!errors.maxInvestors?.message}
                      errorMessage={errors.maxInvestors?.message}
                    />
                  )}
                />
              </Stack>
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
