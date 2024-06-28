import {
  MonoLogoGithub,
  MonoLogoLinkedin,
  MonoLogoX,
} from '@kadena/react-icons/system';
import { Heading, Stack, Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { Media } from '../layout/media';
import Logo from '../logo/logo';
import FooterColumn from './footer-column';
import FooterLink from './footer-link';
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
            <Logo />
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
            <FooterColumn title="Build">
              <FooterLink href="https://www.kadena.io/marmalade">
                Marmalade
              </FooterLink>
              <FooterLink href="https://www.kadena.io/spirekey">
                Kadena SpireKey
              </FooterLink>
              <FooterLink href="https://www.kadena.io/tools">Tools</FooterLink>
              <FooterLink href="https://chainweaver.kadena.network/">
                Chainweaver Wallet
              </FooterLink>
              <FooterLink href="https://explorer.chainweb.com/mainnet">
                Block Explorer
              </FooterLink>
              <FooterLink href="https://www.npmjs.com/package/@kadena/client">
                Kadena Client
              </FooterLink>
              <FooterLink href="https://tools.kadena.io/">
                Builder Tools
              </FooterLink>
              <FooterLink href="https://www.kadena.io/ecosystem">
                Ecosystem
              </FooterLink>
              <FooterLink href="https://docs.kadena.io/">
                Developer Docs
              </FooterLink>
            </FooterColumn>
            <FooterColumn title="Blockchain">
              <FooterLink href="https://www.kadena.io/chainweb">
                Chainweb
              </FooterLink>
              <FooterLink href="https://www.kadena.io/pact">Pact</FooterLink>
              <FooterLink href="https://www.kadena.io/ecosystem">
                Ecosystem
              </FooterLink>
              <FooterLink href="https://www.kadena.io/defi">Defi</FooterLink>
            </FooterColumn>
          </Stack>

          <Stack
            className={doubleContentClass}
            gap="xl"
            flexDirection={{ xs: 'column', lg: 'row' }}
          >
            <FooterColumn title="Learn">
              <FooterLink href="https://www.kadena.io/blog">Blog</FooterLink>
              <FooterLink href="https://www.kadena.io/whitepapers">
                Whitepapers
              </FooterLink>
              <FooterLink href="https://www.kadena.io/academy">
                Academy
              </FooterLink>
              <FooterLink href="https://docs.kadena.io/">
                Developer Docs
              </FooterLink>
            </FooterColumn>
            <FooterColumn title="Participate">
              <FooterLink href="https://www.kadena.io/community">
                Community
              </FooterLink>
              <FooterLink href="https://www.kadena.io/kda-token">
                KDA Token
              </FooterLink>
              <FooterLink href="https://www.kadena.io/grants">
                Grants
              </FooterLink>
              <FooterLink href="https://www.kadena.io/cabinet">
                Kadena Cabinet
              </FooterLink>
              <FooterLink href="https://www.kadena.io/connect">
                Kadena Connect
              </FooterLink>
              <FooterLink href="https://www.kadena.io/beyond-the-block">
                Beyod the Block
              </FooterLink>
            </FooterColumn>
          </Stack>
          <FooterColumn title="Company">
            <FooterLink href="https://www.kadena.io/about">
              About Kadena
            </FooterLink>
            <FooterLink href="https://boards.greenhouse.io/kadenallc">
              Careers
            </FooterLink>
            <FooterLink href="https://www.kadena.io/media-kit">
              Media Kit
            </FooterLink>
          </FooterColumn>
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
