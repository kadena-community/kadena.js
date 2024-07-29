import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { CookieConsent } from '../CookieConsent/CookieConsent';
import { contentClass, documentStyle, layoutWrapperClass } from './styles.css';

import { useSearch } from '@/context/searchContext';
import { Logo } from '../Logo/Logo';
import { Link } from '../Routing/Link';
import { SearchComponent } from '../Search/SearchComponent/SearchComponent';

interface IProps {
  children?: ReactNode;
}

export const Layout: FC<IProps> = ({ children }: IProps) => {
  const {
    setSearchQuery,
    searchQuery,
    searchOption,
    setSearchOption,
    isLoading,
  } = useSearch();

  return (
    <div className={documentStyle}>
      <CookieConsent />
      <Header />
      <Stack
        as="main"
        flexDirection="column"
        className={classNames(layoutWrapperClass, contentClass)}
      >
        <Stack
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          marginInline="lg"
          gap="md"
          marginBlock="xxxl"
        >
          <Stack position="relative">
            <Link href="/">
              <Logo />
            </Link>
          </Stack>

          <SearchComponent
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={isLoading}
          />
        </Stack>

        {children}
      </Stack>
      <Footer />
    </div>
  );
};
