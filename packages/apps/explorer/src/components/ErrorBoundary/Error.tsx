'use client';
import {
  Button,
  Card,
  Heading,
  Stack,
  Text,
  ThemeAnimateIcon,
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

const GlobalError = ({ error, resetError }: any) => {
  const { theme, rotateTheme } = useTheme();

  useEffect(() => {
    console.log('Logging error to Sentry:', error);
    Sentry.captureException(error);
    console.log('done');
  }, [error]);

  return (
    <>
      <FocussedLayoutProvider>
        <FocussedLayoutHeaderAside>
          <Button
            isCompact
            variant="transparent"
            onPress={rotateTheme}
            startVisual={<ThemeAnimateIcon theme={theme} />}
          />
        </FocussedLayoutHeaderAside>
        <FocussedLayout>
          <Card fullWidth>
            <CardContentBlock title="Error">
              <Stack flexDirection="column" gap="md">
                <Heading as="h2">Something went wrong.</Heading>

                <Text>{error?.toString()}</Text>
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
