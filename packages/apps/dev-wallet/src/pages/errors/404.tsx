import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { MonoFindInPage } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { warningIconColorClass, wrapperClass } from './styles.css';

export const NotFound = () => {
  const handleBack = () => {
    if (!window.history) return;
    window.history.back();
  };

  return (
    <>
      <CardContent
        label="Page not found"
        id="404"
        description=""
        visual={
          <Stack className={warningIconColorClass}>
            <MonoFindInPage width={36} height={36} />
          </Stack>
        }
      />
      <Stack
        flexDirection="column"
        gap="xxl"
        marginBlockEnd="xxxl"
        className={wrapperClass}
      >
        <Stack flexDirection="column">
          <Heading variant="h5">Something is wrong</Heading>
          <Text>
            It seems that the page you are trying to access in not available.
          </Text>
        </Stack>

        <Stack flexDirection="column">
          <Heading variant="h6">Reach out!</Heading>
          <Text>
            Please don’t hesitate to reach out if you have any concerns or
            believe there may be an issue with the system. We’re here to help!
          </Text>
        </Stack>

        <Stack justifyContent="flex-end" gap="md">
          <a href="https://discord.com/invite/kadena" target="_blank">
            <Button variant="outlined">Get support</Button>
          </a>
          <Button variant="primary" onPress={handleBack}>
            Go Back
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
