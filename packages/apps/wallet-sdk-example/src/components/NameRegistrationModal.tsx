import React from 'react';
import { NameRegistrationForm } from './NameRegistrationForm';

interface NameRegistrationModalProps {
  owner: string;
  address: string;
  onClose: () => void;
  onRegistered?: () => void;
}

export const NameRegistrationModal: React.FC<NameRegistrationModalProps> = ({
  owner,
  address,
  onClose,
  onRegistered,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        style={{
          backgroundColor: '#1B2330',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Register Kadena Name
        </h2>
        <NameRegistrationForm
          initialOwner={owner}
          initialAddress={address}
          onRegistered={() => {
            onRegistered?.();
            onClose();
          }}
        />
        <button onClick={onClose} className="mt-4 text-white underline">
          Close
        </button>
      </div>
    </div>
  );
};
