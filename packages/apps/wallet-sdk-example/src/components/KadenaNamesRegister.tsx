import React from 'react';
import { NameRegistrationForm } from './NameRegistrationForm';

export const KadenaNamesRegister: React.FC = () => {
  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Register Kadena Name
      </h2>
      <NameRegistrationForm
        onRegistered={() => {
          // done
        }}
      />
    </div>
  );
};
