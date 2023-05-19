import React, { FormEvent, useState } from 'react';
import {
  checkBalance,
  type ChainResult,
} from '../../services/accounts/get-balance';
import Layout from '../../components/layout/layout';
import logo from '../../assets/k-logo-component.svg';
import './check.balance.css';
import chain from '../../assets/chain.svg';
import chevronLeft from '../../assets/chevron-left.svg';
import { useNavigate } from 'react-router-dom';
import { Button } from '@kadena/react-components';

const CheckBalance = (): JSX.Element => {
  const [inputServerValue, setServerValue] = useState<string>('');
  const [inputTokenValue, setTokenValue] = useState<string>('');
  const [inputAccountValue, setAccountValue] = useState<string>('');
  const [results, setResults] = useState<ChainResult[]>([]);
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/');
  };
  const handleInputServerChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setServerValue(event.target.value);
  };
  const handleInputTokenChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setTokenValue(event.target.value);
  };
  const handleInputAccountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setAccountValue(event.target.value);
  };
  const getBalance = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    checkBalance(inputServerValue, inputTokenValue, inputAccountValue)
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const calculateTotal = (): number =>
    results.reduce(
      (acc, item) => acc + parseFloat(item.data?.balance ?? '0'),
      0,
    );

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
          <p
            className="back"
            onClick={() => {
              handleClick();
            }}
          >
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
          <form
            onSubmit={(event) => {
              getBalance(event);
            }}
          >
            <div className="account-form">
              <div id="server-field" className="field">
                <label className="input-label">Target Chainweb Server</label>
                <input
                  type="text"
                  id="server"
                  placeholder="Enter Node Server"
                  onChange={handleInputServerChange}
                  value={inputServerValue}
                  className="input-field"
                />
              </div>
              <div id="server-field" className="field">
                <label className="input-label">Token Name</label>
                <input
                  type="text"
                  id="server"
                  placeholder="Enter Token Name"
                  onChange={handleInputTokenChange}
                  value={inputTokenValue}
                  className="input-field"
                />
              </div>
              <div id="server-field" className="field">
                <label className="input-label">Your Account Name</label>
                <input
                  type="text"
                  id="server"
                  placeholder="Enter Your Account"
                  onChange={handleInputAccountChange}
                  value={inputAccountValue}
                  className="input-field"
                />
              </div>
            </div>
            <div className="form-button">
              <Button title="Get Account Balance">Get Account Balance</Button>
            </div>
          </form>
        </div>

        {results.length > 0 ? (
          <div className="result-container">
            <div className="total-container">
              <div className="total-chunk">
                <p className="account-label">Account Name</p>
                <p className="account-name-value">{inputAccountValue}</p>
              </div>
              <div className="total-chunk">
                <p className="account-label">Total Balance</p>
                <p className="account-total-value">
                  {calculateTotal().toFixed(3)} KDA
                </p>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead className="table-head">
                  <tr>
                    <th>Chain</th>
                    <th>Guard</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => {
                    console.log(result);
                    return (
                      <tr key={result.chain}>
                        <td>{result.chain}</td>
                        <td>
                          <p>{result.data?.guard.pred}</p>
                          {result.data?.guard.keys.map((key) => (
                            <span key={key}>{key}</span>
                          ))}
                        </td>
                        <td>{result.data?.balance ?? 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  );
};

export default CheckBalance;
