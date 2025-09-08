import React, { useState } from 'react';
import { callContract } from '../utils/callFunction';
import type contractConfig from '../utils/contractConfig.json';

export type ContractFunction = (typeof contractConfig.functions)[number];

interface Props {
  fn: ContractFunction;
  accountRef: React.RefObject<string>;
}

const FunctionCard: React.FC<Props> = ({ fn, accountRef }) => {
  const [inputs, setInputs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInput = (index: number, value: string) => {
    const arr = [...inputs];
    arr[index] = value;
    setInputs(arr);
    console.log('[input]', fn.name, 'arg', index, ':', value);
  };

  const onCall = async () => {
    const account = accountRef.current?.trim() || '';
    console.log('[call]', fn.name, 'inputs:', inputs, 'account:', account);

    if (!account) {
      setError('Please enter an account first');
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const capsArr = (fn as any).caps ?? [];
      const res = await callContract(
        fn.name,
        inputs,
        fn.type as 'read' | 'write',
        account,
        capsArr,
      );
      console.log('[result]', res);
      setResult(res);
      setError('');
    } catch (err: any) {
      console.error('[error]', err);
      setError(err.message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '1.5rem',
        background: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.15s ease-in-out, transform 0.15s ease-in-out',
        height: 'fit-content',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <strong
          style={{
            fontSize: '1.1rem',
            color: '#212529',
          }}
        >
          {fn.name}
        </strong>

        <span
          style={{
            color: '#6c757d',
            fontSize: '0.9rem',
            marginLeft: '0.5rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            backgroundColor: fn.type === 'read' ? '#e3f2fd' : '#fff3e0',
            color: fn.type === 'read' ? '#1565c0' : '#ef6c00',
            padding: '0.2rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
          }}
        >
          {fn.type}
        </span>
      </div>

      {(fn as any).caps?.length ? (
        <div
          style={{
            fontSize: '0.75rem',
            color: '#dc3545',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
          }}
        >
          <strong>Requires:</strong> {(fn as any).caps.join(', ')}
        </div>
      ) : null}

      <div style={{ marginBottom: '1rem' }}>
        {fn.args.map((a, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={a.name}
            value={inputs[idx] || ''}
            onChange={(e) => handleInput(idx, e.target.value)}
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              width: '100%',
              padding: '0.5rem',
              fontSize: '0.95rem',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              outline: 'none',
              transition: 'border-color 0.15s ease-in-out',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#80bdff')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
          />
        ))}
      </div>

      <button
        style={{
          padding: '0.75rem',
          width: '100%',
          backgroundColor: isLoading ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'background-color 0.15s ease-in-out',
        }}
        onClick={onCall}
        disabled={isLoading}
        onMouseOver={(e) =>
          !isLoading && (e.currentTarget.style.backgroundColor = '#218838')
        }
        onMouseOut={(e) =>
          !isLoading && (e.currentTarget.style.backgroundColor = '#28a745')
        }
      >
        {isLoading ? 'Calling...' : 'Call Function'}
      </button>

      {/* Result Display */}
      {(result !== null || error) && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: error ? '#dc3545' : '#28a745',
            backgroundColor: error ? '#f8d7da' : '#d4edda',
          }}
        >
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: error ? '#721c24' : '#155724',
              marginBottom: '0.5rem',
            }}
          >
            {error ? 'Error' : 'Result'}
          </div>

          {error ? (
            <div
              style={{
                color: '#721c24',
                fontSize: '0.9rem',
                wordBreak: 'break-word',
              }}
            >
              {error}
            </div>
          ) : (
            <div
              style={{
                color: '#155724',
                fontSize: '0.9rem',
                maxHeight: '150px',
                overflowY: 'auto',
                wordBreak: 'break-word',
              }}
            >
              <pre
                style={{
                  margin: '0',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                }}
              >
                {typeof result === 'string'
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <button
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: error ? '#721c24' : '#155724',
              border: '1px solid',
              borderColor: error ? '#721c24' : '#155724',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '500',
            }}
            onClick={() => {
              setResult(null);
              setError('');
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default FunctionCard;
