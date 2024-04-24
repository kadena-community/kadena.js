import { contractParser } from '@kadena/pactjs-generator';
import {
  Accordion,
  AccordionItem,
  Button,
  Heading,
  Text,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import type { IChainModule } from '../types';
import type { Contract } from './utils';
import { contractToAccordionItems } from './utils';

export interface IOutlineProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedModule?: IChainModule;
  onInterfaceClick: (module: IChainModule) => void;
  onInterfacesExpand: (interfaces: IChainModule[]) => void;
}

const Outline = (props: IOutlineProps): React.JSX.Element => {
  const { selectedModule, onInterfaceClick, onInterfacesExpand, className } =
    props;
  const { t } = useTranslation('common');

  let parsedContract: Contract;
  if (selectedModule) {
    const [, namespace] = selectedModule.moduleName.split('.');
    [[parsedContract]] = contractParser(selectedModule.code!, namespace);
  }

  return (
    <div className={className}>
      <Heading as="h4">
        Outline
        {selectedModule
          ? ` ${selectedModule.moduleName} @ ${selectedModule.chainId}`
          : null}
      </Heading>
      {selectedModule ? (
        <Accordion
          items={contractToAccordionItems(parsedContract!)}
          onSelectionChange={(keys) => {
            if (keys instanceof Set) {
              if (keys.has('Interfaces')) {
                onInterfacesExpand(
                  parsedContract!.usedInterface!.map((i) => {
                    return {
                      chainId: selectedModule.chainId,
                      moduleName: i.name,
                      network: selectedModule.network,
                    };
                  }),
                );
              }
            }
          }}
        >
          {(item) => {
            return (
              <AccordionItem
                key={item.title}
                title={item.title}
                hasChildItems={true}
              >
                <ul>
                  {item.items.map((child) => {
                    return (
                      <li key={`${item.title}-${child.title}`}>
                        {item.title === 'Interfaces' ? (
                          <Button
                            onPress={() =>
                              onInterfaceClick({
                                chainId: selectedModule.chainId,
                                moduleName: child.title,
                                network: selectedModule.network,
                              })
                            }
                          >
                            {child.title}
                          </Button>
                        ) : (
                          <Text>{child.title}</Text>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </AccordionItem>
            );
          }}
        </Accordion>
      ) : (
        <Text>
          {t('Select/open a module to see the outline of the contract/module')}
        </Text>
      )}
    </div>
  );
};

export default Outline;
