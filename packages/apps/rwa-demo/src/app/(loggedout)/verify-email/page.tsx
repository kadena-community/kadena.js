'use client';
import type { ICompactStepperItemProps } from '@kadena/kode-ui';
import {
  Button,
  Card,
  CompactStepper,
  Notification,
  NotificationHeading,
  Stack,
} from '@kadena/kode-ui';
import {
  CardContentBlock,
  FocussedLayoutHeaderContent,
  useNotifications,
} from '@kadena/kode-ui/patterns';
import { useSearchParams } from 'next/navigation';

import { SetPasswordForm } from '@/components/SetPasswordForm/SetPasswordForm';
import { MonoPalette, MonoPassword, MonoVerified } from '@kadena/kode-icons';

import { LoginForm } from '@/components/LoginForm/LoginForm';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { cardWrapperClass } from '../style.css';

interface ICardContentProps {
  label: string;
  id?: string;
  description: string;
  visual?: ReactElement;
  supportingContent?: ReactElement;
}

type IStepKeys = 'verify' | 'set-password' | 'done';

const steps: ICardContentProps[] = [
  {
    label: 'Verify',
    id: 'verify',
    description: 'Verifiy your email address to use the application',
    visual: <MonoVerified width={40} height={40} />,
  },
  {
    label: 'Choose password',
    id: 'set-password',
    description:
      'Carefully select your password as this will be your main security of your wallet',
    visual: <MonoPassword width={40} height={40} />,
  },
  {
    label: 'Ready to go',
    id: 'done',
    description: 'You are ready to sign in and go',
    visual: <MonoPalette width={40} height={40} />,
  },
] as const;

const Home = () => {
  const [step, setStep] = useState<IStepKeys>('verify');
  const [isPending, setIsPending] = useState(false);

  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();
  const oobCode = decodeURIComponent(searchParams.get('oobCode') ?? ''); // gets ?foo=value
  const email = decodeURIComponent(searchParams.get('email') ?? ''); // gets ?foo=value

  const getStepIdx = (key: IStepKeys): number => {
    return steps.findIndex((step) => step.id === key) ?? 0;
  };

  const handleVerify = async () => {
    setIsPending(true);
    const result = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ oobCode, email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    addNotification({
      intent: result.status === 200 ? 'positive' : 'negative',
      message: result.statusText || 'Unknown error',
    });

    setIsPending(false);

    if (result.status === 200) {
      setStep('set-password');
    }
  };

  const stepContent = steps[getStepIdx(step)];
  return (
    <>
      <FocussedLayoutHeaderContent>
        <CompactStepper
          stepIdx={getStepIdx(step)}
          steps={steps as ICompactStepperItemProps[]}
        />
      </FocussedLayoutHeaderContent>
      <Card fullWidth className={cardWrapperClass}>
        <CardContentBlock
          title={stepContent.label}
          description={stepContent.description}
          visual={stepContent.visual}
        >
          {step === 'verify' && (
            <>
              {!oobCode ||
                (!email && (
                  <Notification role="status" intent="negative">
                    <NotificationHeading>
                      Missing Parameters
                    </NotificationHeading>
                    Please provide both oobCode and email in the URL query
                    parameters.
                  </Notification>
                ))}

              <Stack
                flexDirection="column"
                marginBlockStart="sm"
                justifyContent="flex-end"
                width="100%"
              >
                <Stack justifyContent="flex-end">
                  <Button isLoading={isPending} onPress={handleVerify}>
                    Verify your Email
                  </Button>
                </Stack>
              </Stack>
            </>
          )}

          {step === 'set-password' && <SetPasswordForm setStep={setStep} />}

          {step === 'done' && (
            <Stack flexDirection="column" gap="sm">
              <LoginForm />
            </Stack>
          )}
        </CardContentBlock>
      </Card>
    </>
  );
};

export default Home;
