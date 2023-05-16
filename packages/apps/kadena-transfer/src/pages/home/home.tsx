import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/k-logo-component.svg';
import account from '../../assets/account.svg';
import key from '../../assets/key.svg';
import chain from '../../assets/chain.svg';
import './home.css';
import Layout from '../../components/layout/layout';

const Home = (): JSX.Element => {
  const navigate = useNavigate();

  const handleClick = (): any => {
    navigate('/check-balance');
  };

  return (
    <Layout>
      <div className="home-container">
        <img src={logo} alt="logo" className="small-logo" />
        <div className="home-content">
          <h2 className="home-title">Kadena Transfer</h2>
          <div className="home-link" onClick={() => handleClick()}>
            <div className="icon-box">
              <img src={key} alt="balance-logo" className="icon" />
            </div>
            <p className="link-text">Generate KeyPair (save to file)</p>
          </div>
          <div className="home-link" onClick={() => handleClick()}>
            <div className="icon-box">
              <img src={account} alt="balance-logo" className="icon" />
            </div>
            <p className="link-text">Check account balance</p>
          </div>
          <div className="home-link" onClick={() => handleClick()}>
            <div className="icon-box">
              <img src={chain} alt="balance-logo" className="icon" />
            </div>
            <p className="link-text">Transfer</p>
          </div>
          <div className="home-link" onClick={() => handleClick()}>
            <div className="icon-box">
              <img src={chain} alt="balance-logo" className="icon" />
            </div>
            <p className="link-text">Transfer with Ledger</p>
          </div>
          <div className="home-link" onClick={() => handleClick()}>
            <div className="icon-box">
              <img src={chain} alt="balance-logo" className="icon" />
            </div>
            <p className="link-text">Finish CrossChain Transfer</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
