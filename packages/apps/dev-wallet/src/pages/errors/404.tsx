import { Heading, Text } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';

export const NotFound = () => {
  return (
    <>
      <SectionCard>
        <SectionCardContentBlock>
          <SectionCardHeader title="Page not found" description={<></>} />
          <SectionCardBody>
            <Heading variant="h5">Something is wrong</Heading>
            <Text>
              It seems that the page you are trying to access in not available.
            </Text>

            <Heading variant="h5">Reach out!</Heading>
            <Text>
              Please don’t hesitate to reach out if you have any concerns or
              believe there may be an issue with the system. We’re here to help!
            </Text>
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
