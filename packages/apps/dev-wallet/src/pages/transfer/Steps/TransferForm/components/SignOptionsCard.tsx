import { wrapperClass } from '@/pages/errors/styles.css';
import { useShow } from '@/utils/useShow';
import { MonoSignature } from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  Notification,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import {
  Control,
  Controller,
  FormState,
  UseFormSetValue,
} from 'react-hook-form';
import { ITransfer } from '../TransferForm';

interface IProps {
  control: Control<ITransfer, any>;
  error:
    | {
        target: 'from' | `receivers.${number}` | 'gas' | 'meta' | 'general';
        message: string;
      }
    | undefined;
  forceRender: React.Dispatch<React.SetStateAction<number>>;
  hasXChain: boolean;
  crossChainMode: 'x-chain' | 'redistribution';
  setValue: UseFormSetValue<ITransfer>;
  formState: FormState<ITransfer>;
}

export const SignOptionsCard: FC<IProps> = ({
  control,
  error,
  forceRender,
  hasXChain,
  crossChainMode,
  setValue,
  formState,
}) => {
  const [, , AdvancedMode] = useShow(true);
  return (
    <Card fullWidth>
      <CardContentBlock
        level={2}
        title="Sign options"
        visual={<MonoSignature width={24} height={24} />}
      >
        <Stack
          flexDirection="column"
          gap="xxl"
          marginBlockEnd="xxxl"
          className={wrapperClass}
        >
          <AdvancedMode>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  aria-label="Sign Options"
                  direction={'column'}
                  defaultValue={'normalTransfer'}
                  value={field.value}
                  onChange={(value) => {
                    console.log('value', value);
                    field.onChange(value);
                    forceRender((prev) => prev + 1);
                  }}
                >
                  <Radio value="normalTransfer">
                    {
                      (
                        <Stack alignItems={'center'} gap={'sm'}>
                          Normal transfer
                          <Text size="small">Sign by sender</Text>
                        </Stack>
                      ) as any
                    }
                  </Radio>

                  <Radio value="safeTransfer">
                    {
                      (
                        <Stack flexDirection={'column'} gap={'sm'}>
                          <Stack alignItems={'center'} gap={'sm'}>
                            Safe transfer
                            <Text size="small">
                              Sign by both sender and receiver
                            </Text>
                          </Stack>
                          {hasXChain &&
                            crossChainMode === 'x-chain' &&
                            field.value === 'safeTransfer' && (
                              <Notification role="alert" intent="warning">
                                Note: You cant perform a cross-chain safe
                                transfer. the transaction(s) will be created as
                                normal transfer. if you want to do a safe
                                transfer, please switch to redistribution mode
                                <Stack gap="sm">
                                  <Button
                                    isCompact
                                    variant="outlined"
                                    onClick={() => {
                                      setValue('xchainMode', 'redistribution');
                                    }}
                                  >
                                    Enable Redistribution
                                  </Button>
                                </Stack>
                              </Notification>
                            )}
                        </Stack>
                      ) as any
                    }
                  </Radio>
                </RadioGroup>
              )}
            />
          </AdvancedMode>

          {(error || !formState.isValid) && formState.isSubmitted && (
            <Notification role="alert" intent="negative">
              Invalid Data, Please check the input(s) (
              {[...Object.keys(formState.errors), error?.target.split('.')[0]]
                .filter(Boolean)
                .join(', ')}
              )
            </Notification>
          )}
          <Stack
            alignItems={'flex-start'}
            gap="lg"
            marginBlockStart={'lg'}
            flexDirection={'column'}
          >
            {!!error && error.target === 'general' && (
              <Notification role="alert" intent="negative">
                {error.message}
              </Notification>
            )}
          </Stack>
        </Stack>
      </CardContentBlock>
    </Card>
  );
};
