import { menuConfig } from '@/utils/menuConfig';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import {
  MonoLogoGithub,
  MonoLogoLinkedin,
  MonoLogoX,
} from '@kadena/react-icons/system';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { Media } from '../layout/media';
import Logo from '../logo/logo';
import FooterColumn from './footer-column';
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
      gap={{ xs: 'xs', md: 'xxxl' }}
    >
      <Media greaterThanOrEqual="md">
        <Stack width="100%" flexDirection={{ xs: 'column', sm: 'row' }}>
          <Stack flex={1} flexDirection="column" gap="lg" marginInlineEnd="lg">
            <Link href="/">
              <Logo />
            </Link>
            <Text>
              Kadena is a high-performance blockchain platform enabling
              scalable, secure, and efficient smart contracts.
            </Text>
            <Stack flexDirection="column" marginBlockEnd="md">
              <Heading as="h6">Socials</Heading>
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
            gap="xl"
            flexDirection={{ xs: 'column', lg: 'row' }}
          >
            <FooterColumn data={menuConfig[0]} />
            <FooterColumn data={menuConfig[1]} />
          </Stack>

          <Stack
            className={doubleContentClass}
            gap="xl"
            flexDirection={{ xs: 'column', lg: 'row' }}
          >
            <FooterColumn data={menuConfig[2]} />
            <FooterColumn data={menuConfig[3]} />
          </Stack>
          <FooterColumn data={menuConfig[4]} />
        </Stack>
      </Media>
      <Stack
        width="100%"
        marginBlockStart={{ xs: 'md', md: 'xxxl' }}
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
