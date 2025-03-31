import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { CardFooterContent } from '@/App/LayoutLandingPage/components/CardFooterContent';
import { LandingPageLayout } from '@/App/LayoutLandingPage/Layout';
import { useIsInDevelopment } from '@/Components/InDevelopmentProvider/InDevelopmentProvider';
import { MonoWarning } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { wrapperClass } from '../errors/styles.css';
import { iconColorClass } from './styles.css';

export const InDevelopment: FC = () => {
  const { hideMessage } = useIsInDevelopment();

  return (
    <LandingPageLayout>
      <CardContent
        label="Caution"
        id="indev"
        description="Please read the instructions and terms carefully before using this application."
        visual={
          <Stack className={iconColorClass}>
            <MonoWarning width={36} height={36} />
          </Stack>
        }
      />
      <Stack
        flexDirection="column"
        gap="xxl"
        style={{ marginBlockStart: '-80px' }}
        marginBlockEnd="xxxl"
        className={wrapperClass}
      >
        <Stack flexDirection="column">
          <Heading variant="h5">Under development</Heading>
          <Text>
            This is an unreleased development version of the Kadena Wallet. Use
            with caution!
          </Text>
        </Stack>
      </Stack>

      <CardFooterContent>
        <Button variant="negative" onPress={hideMessage}>
          I understand the risks
        </Button>
      </CardFooterContent>
    </LandingPageLayout>
  );
};
