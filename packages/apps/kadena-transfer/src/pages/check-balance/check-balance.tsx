import React from 'react';
import { checkBalance } from '../../services/accounts/get-balance';
import Layout from '../../components/layout/layout';
import logo from '../../assets/k-logo-component.svg';
import './check.balance.css';
import chain from '../../assets/chain.svg';
import chevronLeft from '../../assets/chevron-left.svg';
import { useNavigate } from 'react-router-dom';

import { Button } from '@kadena/react-components';

const CheckBalance = (): JSX.Element => {
  const navigate = useNavigate();

  const handleClick = (): any => {
    navigate('/');
  };

  const getBalance = (): any => {
    const balance = checkBalance(
      'api.testnet.chainweb.com',
      'coin',
      'k:2a41f51efddc35f479c8fc21985d7fc2e4766859d7a7629be48a3017d8b9602a',
    );
    return balance;
  };
  return (
    <Layout>
      <header className="header-container">
        <div className="header-logo-wallet-content">
          <div className="logo-text-container">
            <img src={logo} alt="logo" className="header-logo" />
            <div className="header-text">
              <p className="text-bold">K:Transfer</p>
              <p className="text-normal">Kadena Testnet</p>
            </div>
          </div>
          <div className="wallet-not-connected">
            <p>Connect your wallet</p>
            <img src={chain} alt="balance-logo" className="icon-image" />
          </div>
        </div>

        <div className="title-container">
          <p className="back" onClick={() => handleClick()}>
            <img
              src={chevronLeft}
              alt="balance-logo"
              className="chevron-left"
            />
            Back
          </p>
          <p className="title">Check account balance</p>
        </div>
      </header>

      <main className="main-content">
        <div className="form-container">
          <div className="account-form">
            <div id="server-field" className="field">
              <label className="input-label">Target Chainweb Server</label>
              <input
                type="text"
                id="server"
                placeholder="Enter Node Server"
                className="input-field"
              />
            </div>
            <div id="server-field" className="field">
              <label className="input-label">Token Name</label>
              <input
                type="text"
                id="server"
                placeholder="Enter Token Name"
                className="input-field"
              />
            </div>
            <div id="server-field" className="field">
              <label className="input-label">Your Account Name</label>
              <input
                type="text"
                id="server"
                placeholder="Enter Your Account"
                className="input-field"
              />
            </div>
          </div>
          <div className="form-button">
            <Button onClick={() => getBalance()} title="Get Account Balance">
              Get Account Balance
            </Button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CheckBalance;
