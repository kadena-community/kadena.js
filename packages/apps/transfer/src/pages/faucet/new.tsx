import { NextPageWithLayout } from '../_app';

import { StyledContainer, StyledHeader, StyledSection } from './styles';

import { Layout, NestedLayout } from '@/components/Common';
import Notification from '@/components/Global/Notification';
import { GetStaticProps } from 'next';
import React from 'react';

export const getStaticProps: GetStaticProps = async () => {
  return { props: { title: 'Create and Fund New Account' } };
};

const NewFaucetPage: NextPageWithLayout = (props) => {
  return (
    <>
      <Notification
        title="Before you start"
        body='Generate a key pair by visiting this <a href="#"><strong>webpage</strong></a> or by downloading a <a href="#"><strong>wallet</strong></a>'
      />
      <StyledContainer className="grid grid-cols-1 divide-y">
        <StyledSection>
          <StyledHeader>
            <h2>Account</h2>
            <a href="#">Fill in public key as your account name +</a>
          </StyledHeader>
        </StyledSection>
        <StyledSection>
          <StyledHeader>
            <h2>Public Key</h2>
          </StyledHeader>
        </StyledSection>
      </StyledContainer>
    </>
  );
};

NewFaucetPage.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

export default NewFaucetPage;
