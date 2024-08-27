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
import { LayoutMain } from './components/LayoutMain';
import {
  searchWrapperClass,
  searchWrapperVariants,
} from './components/styles.css';
import { Media } from './media';

interface IProps {
  children?: ReactNode;
  layout?: 'default' | 'full';
}

export const Layout: FC<IProps> = ({ children, layout = 'default' }) => {
  const {
    setSearchQuery,
    searchQuery,
    searchOption,
    setSearchOption,
    isLoading,
  } = useSearch();

  return (
    <div className={classNames(documentStyle)}>
      <CookieConsent />
      <Header />
      <Stack
        as="main"
        flexDirection="column"
        className={classNames(layoutWrapperClass, contentClass)}
      >
        <Stack
          className={classNames(
            searchWrapperClass,
            searchWrapperVariants({ variant: layout }),
          )}
          marginBlock="xxxl"
        >
          <Media greaterThan="sm">
            <Stack position="relative" justifyContent="center" width="100%">
              <Link href="/">
                <Logo />
              </Link>
            </Stack>
          </Media>

          <SearchComponent
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={isLoading}
          />
        </Stack>

        <LayoutMain layout={layout}>{children}</LayoutMain>
      </Stack>
      <Footer />
    </div>
  );
};
