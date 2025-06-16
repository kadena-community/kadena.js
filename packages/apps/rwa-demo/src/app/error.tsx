'use client';
import { MonoDarkMode, MonoLightMode } from '@kadena/kode-icons';
import {
  Button,
  Card,
  Heading,
  Stack,
  Text,
  Themes,
  useTheme,
} from '@kadena/kode-ui';
import {
  CardContentBlock,
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutProvider,
} from '@kadena/kode-ui/patterns';
import * as Sentry from '@sentry/nextjs';
import React, { useEffect } from 'react';
import { cardWrapperClass } from './(loggedout)/style.css';

const GlobalError = ({ error, componentStack, resetError }: any) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <>
      <FocussedLayoutProvider>
        <FocussedLayoutHeaderAside>
          <Button
            isCompact
            variant="transparent"
            onPress={() => toggleTheme()}
            startVisual={
              theme === 'dark' ? <MonoDarkMode /> : <MonoLightMode />
            }
          />
        </FocussedLayoutHeaderAside>
        <FocussedLayout>
          <Card fullWidth className={cardWrapperClass}>
            <CardContentBlock title="Error">
              <Stack flexDirection="column" gap="md">
                <Heading as="h2">Something went wrong.</Heading>

                <Text>{error?.toString()}</Text>

                <Stack width="100%" justifyContent="flex-end">
                  <Button onPress={resetError}>Try again</Button>
                </Stack>
              </Stack>
            </CardContentBlock>
          </Card>

          <FocussedLayoutFooter />
        </FocussedLayout>
      </FocussedLayoutProvider>
    </>
  );
};

export default Sentry.withErrorBoundary(GlobalError, {
  fallback: (props) => <GlobalError {...props} />,
  showDialog: true,
});
