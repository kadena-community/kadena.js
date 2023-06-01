import { GetStaticProps } from 'next';
import React, { type FC } from 'react';

export const getStaticProps: GetStaticProps = async () => {
  return { props: { title: 'HomePage' } };
};

const FaucetPage: FC = () => {
  return <h2>Hello world</h2>;
};

export default FaucetPage;
