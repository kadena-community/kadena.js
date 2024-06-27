import {
  MonoLogoGithub,
  MonoLogoLinkedin,
  MonoLogoX,
} from '@kadena/react-icons/system';
import { Heading, Stack, Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import Logo from '../logo/logo';
import {
  doubleContentClass,
  footerClass,
  footerLinkClass,
  socialLinkClass,
} from './style.css';

const Footer: FC = () => {
  const year = new Date().getFullYear();
  return (
    <Stack
      as="footer"
      className={footerClass}
      flexDirection="column"
      gap="xxxl"
    >
      <Stack width="100%" flexDirection={{ xs: 'column', md: 'row' }}>
        <Stack flex={1} flexDirection="column" gap="lg" marginInlineEnd="lg">
          <Logo />
          <Text>
            Kadena is a high-performance blockchain platform enabling scalable,
            secure, and efficient smart contracts.
          </Text>
          <Stack flexDirection="column" marginBlockEnd="md">
            <Heading as="h5">Socials</Heading>
            <Stack gap="sm">
              <a
                className={socialLinkClass}
                href="https://x.com/kadena_io"
                target="_blank"
                rel="noreferrer"
              >
                <MonoLogoX />
              </a>
              <a
                className={socialLinkClass}
                href="https://www.linkedin.com/company/kadena-llc/mycompany/"
                target="_blank"
                rel="noreferrer"
              >
                <MonoLogoLinkedin />
              </a>
              <a
                className={socialLinkClass}
                href="https://github.com/kadena-community"
                target="_blank"
                rel="noreferrer"
              >
                <MonoLogoGithub />
              </a>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          className={doubleContentClass}
          flexDirection={{ xs: 'column', lg: 'row' }}
        >
          <Stack flex={1} marginBlockStart="sm">
            <Heading as="h5">Build</Heading>
          </Stack>
          <Stack flex={1} marginBlockStart="sm">
            <Heading as="h5">Blockchain</Heading>
          </Stack>
        </Stack>

        <Stack
          className={doubleContentClass}
          flexDirection={{ xs: 'column', lg: 'row' }}
        >
          <Stack flex={1} marginBlockStart="sm">
            <Heading as="h5">Learn</Heading>
          </Stack>
          <Stack flex={1} marginBlockStart="sm">
            <Heading as="h5">Participate</Heading>
          </Stack>
        </Stack>
        <Stack flex={1} marginBlockStart="sm">
          <Heading as="h5">Company</Heading>
        </Stack>
      </Stack>
      <Stack
        width="100%"
        marginBlockStart="xxxl"
        gap={{ md: 'md' }}
        flexDirection={{ xs: 'column', md: 'row' }}
      >
        <Text>@Kadena LCC @{year}</Text>
        <Stack flex={1} />
        <a className={footerLinkClass} href="https://kadena.io/privacy-policy">
          <Text>Privacy Policy</Text>
        </a>
        <a
          className={footerLinkClass}
          href="https://www.kadena.io/terms-and-conditions"
        >
          <Text> Terms and Conditions</Text>
        </a>
      </Stack>
    </Stack>
  );
};

export default Footer;
