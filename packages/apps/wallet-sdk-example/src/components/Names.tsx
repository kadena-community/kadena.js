// AddressNameComponent.tsx
import React from 'react';
import { useAddressToName, useNameToAddress } from '../hooks/nameresolver';

export const KadenaNames: React.FC = () => {
  const {
    name: resolvedName,
    error: nameError,
    loading: nameLoading,
    setAddress,
    address: inputAddress,
  } = useAddressToName();

  const {
    address: resolvedAddress,
    error: addressError,
    loading: addressLoading,
    setName,
    name: inputName,
  } = useNameToAddress();

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Kadena Address and Name Lookup
      </h2>

      <div className="mb-8">
        <h3 className="text-xl font-medium text-white mb-2">Address to Name</h3>
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full mb-2"
        />
        {nameLoading && <p className="text-text-secondary">Loading...</p>}
        {resolvedName && (
          <p className="text-white">
            <strong>Name:</strong> {resolvedName}
          </p>
        )}
        {nameError && (
          <p className="text-error-color">
            <strong>Error:</strong> {nameError}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-medium text-white mb-2">Name to Address</h3>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full mb-2"
        />
        {addressLoading && <p className="text-text-secondary">Loading...</p>}
        {resolvedAddress && (
          <p className="text-white">
            <strong>Address:</strong> {resolvedAddress}
          </p>
        )}
        {addressError && (
          <p className="text-error-color">
            <strong>Error:</strong> {addressError}
          </p>
        )}
      </div>
    </div>
  );
};
