import { Link } from '@/components/Routing/Link';
import { menuConfig } from '@/config/menuConfig';
import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import {
  MonoLogoGithub,
  MonoLogoLinkedin,
  MonoLogoX,
  MonoMoreVert,
} from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useState } from 'react';
import { Media } from '../Layout/media';
import { Logo } from '../Logo/Logo';
import { FooterColumn } from './FooterColumn';
import {
  doubleContentClass,
  footerClass,
  footerLinkClass,
  socialLinkClass,
  tripleContentClass,
} from './style.css';

export const Footer: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const year = new Date().getFullYear();

  const handleToggleContent = () => {
    setIsOpen((v) => !v);
  };

  const handleAnalyticsForSocial = (social: string) => {
    analyticsEvent(EVENT_NAMES['click:nav_sociallink'], {
      social,
    });
  };
  return (
    <Stack
      as="footer"
      className={footerClass}
      flexDirection="column"
      marginBlockStart="xxxl"
      gap={{ xs: 'xs', md: 'xxxl' }}
    >
      <Stack width="100%" flexDirection={{ xs: 'column', sm: 'row' }}>
        <Stack
          flex={1}
          flexDirection="column"
          gap="lg"
          marginInlineEnd={{ xs: 'no', sm: 'xxl' }}
        >
          <Stack width="100%">
            <Link href="/">
              <Logo />
            </Link>
            <Stack flex={1} />
            <Media lessThan="sm">
              <Button variant="outlined" onPress={handleToggleContent}>
                <MonoMoreVert />
              </Button>
            </Media>
          </Stack>
          <Stack paddingInlineEnd="xxxl" marginInlineEnd="xxxl">
            <Text>
              Kadena is a high-performance blockchain platform enabling
              scalable, secure, and efficient smart contracts.
            </Text>
          </Stack>
          <Stack flexDirection="column" marginBlockEnd="md">
            <Heading as="h6">Socials</Heading>
            <Stack gap="sm">
              <a
                onClick={() => handleAnalyticsForSocial('twitter')}
                className={socialLinkClass}
                href="https://x.com/kadena_io"
                target="_blank"
                rel="noreferrer"
              >
                <MonoLogoX />
              </a>

              <a
                onClick={() => handleAnalyticsForSocial('linkedin')}
                className={socialLinkClass}
                href="https://www.linkedin.com/company/kadena-llc/mycompany/"
                target="_blank"
                rel="noreferrer"
              >
                <MonoLogoLinkedin />
              </a>
              <a
                onClick={() => handleAnalyticsForSocial('github')}
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
          <FooterColumn isOpen={isOpen} data={menuConfig[0]} />
          <FooterColumn isOpen={isOpen} data={menuConfig[1]} />
        </Stack>

        <Stack
          className={tripleContentClass}
          gap="xl"
          flexDirection={{ xs: 'column', lg: 'row' }}
        >
          <FooterColumn isOpen={isOpen} data={menuConfig[2]} />
          <FooterColumn isOpen={isOpen} data={menuConfig[3]} />
          <FooterColumn isOpen={isOpen} data={menuConfig[4]} />
        </Stack>
      </Stack>

      <Stack
        width="100%"
        marginBlockStart={{ xs: 'md', md: 'xxxl' }}
        gap={{ md: 'md' }}
        flexDirection={{ xs: 'column', md: 'row' }}
      >
        <Text>@Kadena LCC @{year}</Text>
        <Stack flex={1} />
        <a
          className={footerLinkClass}
          href="https://www.kadena.io/terms-and-conditions"
        >
          <Text>Terms and Conditions</Text>
        </a>
        <a
          className={footerLinkClass}
          href="https://www.kadena.io/privacy-policy"
        >
          <Text>Privacy Policy</Text>
        </a>
        <a className={footerLinkClass} href="https://www.kadena.io/media-kit">
          <Text>Media Kit</Text>
        </a>
        <a
          className={footerLinkClass}
          href="https://job-boards.greenhouse.io/kadenallc"
        >
          <Text>Careers</Text>
        </a>
      </Stack>
    </Stack>
  );
};
