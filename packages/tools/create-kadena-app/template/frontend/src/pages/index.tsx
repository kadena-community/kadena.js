// Home.tsx
import React, { useRef, useState } from 'react';
import FunctionCard from '../components/FunctionCard';
import contractConfig from '../utils/contractConfig.json';

const Home: React.FC = (): JSX.Element => {
  const accountRef = useRef<string>(''); // ①
  const [account, setAccount] = useState<string>('');

  // Function-specific input handling moved into FunctionCard component
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value);
    accountRef.current = e.target.value; // ② keep ref in sync
  };

  const handleFaucet = async () => {
    alert(`Faucet requested for account: ${account}`);
    // You can replace this with real faucet logic (e.g. `await fundAccount(account)`)
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontSize: '1.8rem',
          marginBottom: '1rem',
          color: '#333',
          textAlign: 'center',
        }}
      >
        Kadena Smart Contract Interface
      </h1>

      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}
      >
        <label
          htmlFor="account"
          style={{
            fontWeight: 'bold',
            display: 'block',
            marginBottom: '0.5rem',
            color: '#495057',
          }}
        >
          Account:
        </label>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <input
            id="account"
            type="text"
            placeholder="Enter account"
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
              accountRef.current = e.target.value;
            }}
            style={{
              width: '300px',
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              outline: 'none',
              transition: 'border-color 0.15s ease-in-out',
            }}
          />

          <button
            onClick={handleFaucet}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.15s ease-in-out',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#0056b3')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#0070f3')
            }
          >
            Request Faucet
          </button>
        </div>
      </div>

      <h3
        style={{
          fontSize: '1.2rem',
          marginBottom: '1rem',
          color: '#333',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '0.5rem',
        }}
      >
        Contract Functions
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {contractConfig.functions.map((fn) => (
          <FunctionCard key={fn.name} fn={fn} accountRef={accountRef} />
        ))}
      </div>
    </div>
  );
};

export default Home;
