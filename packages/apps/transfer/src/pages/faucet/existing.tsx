import { NextPageWithLayout } from '../_app';

import { StyledContainer, StyledHeader, StyledSection } from './styles';

import { Layout, NestedLayout } from '@/components/Common';
import { GetStaticProps } from 'next';
import React from 'react';

export const getStaticProps: GetStaticProps = async () => {
  return { props: { title: 'Add Funds to Existing Account' } };
};

const ExistingFaucetPage: NextPageWithLayout = (props) => {
  return (
    <StyledContainer className="grid grid-cols-1 divide-y">
      <StyledSection>
        <StyledHeader>
          <h2>Account</h2>
          <a href="#">Fill in public key as your account name +</a>
        </StyledHeader>
      </StyledSection>
    </StyledContainer>
  );
};

ExistingFaucetPage.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

export default ExistingFaucetPage;
