import { contractParser } from '@kadena/pactjs-generator';
import { Heading, Text, Tree } from '@kadena/react-ui';

import type { IChainModule } from '../types';

import type { Contract } from './utils';
import { contractToTreeItems } from './utils';

import useTranslation from 'next-translate/useTranslation';
import React from 'react';

export interface IOutlineProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedModule?: IChainModule;
  onInterfaceClick: (module: IChainModule) => void;
}

const Outline = (props: IOutlineProps): React.JSX.Element => {
  const { selectedModule, onInterfaceClick } = props;
  const { t } = useTranslation('common');

  let parsedContract: Contract;
  if (selectedModule) {
    const [, namespace] = selectedModule.moduleName.split('.');
    [[parsedContract]] = contractParser(selectedModule.code!, namespace);
  }

  return (
    <div {...props}>
      <Heading as="h4">
        Outline
        {selectedModule
          ? ` ${selectedModule.moduleName} @ ${selectedModule.chainId}`
          : null}
      </Heading>
      {selectedModule ? (
        <Tree
          items={contractToTreeItems(
            parsedContract!,
            onInterfaceClick,
            selectedModule,
          )}
          isOpen
        />
      ) : (
        <Text>
          {t('Select/open a module to see the outline of the contract/module')}
        </Text>
      )}
    </div>
  );
};

export default Outline;
