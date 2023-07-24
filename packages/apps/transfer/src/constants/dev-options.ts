import { SystemIcon } from '@kadena/react-ui';

import { DevOption } from './kadena';

import React from 'react';


export interface IDevOption {
  title: string;
  text: string;
  icon: React.FC;
  tag?: string;
}

export const devOptions: {
  [Key in DevOption]: IDevOption;
} = {
  BASIC: {
    title: 'Basic User Interface',
    text: 'This view can be used for basic operations and handling things within the user interface.',
    icon: SystemIcon.Application,
  },
  BACKEND: {
    title: 'Backend Developers',
    tag: 'for PACT developers',
    text: 'This option is meant for developers who need more sophisticated options within the user interface.',
    icon: SystemIcon.ApplicationBrackets,
  },
  DAPP: {
    title: 'dApp Developers',
    tag: 'for Javascript developers',
    text: 'This option is meant for developers who need more sophisticated options within the user interface.',
    icon: SystemIcon.ApplicationBrackets,
  },
};
