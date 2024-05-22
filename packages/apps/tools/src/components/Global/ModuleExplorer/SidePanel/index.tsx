import { useWalletConnectClient } from '@/context/connect-wallet-context';
import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoMenuOpen,
  MonoVerticalSplit,
} from '@kadena/react-icons/system';
import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import React, { useState, useTransition } from 'react';
import CustomAccordion from '../../CustomAccordion/CustomAccordion';
import CustomTree, { ICustomTreeProps } from '../../CustomTree/CustomTree';
import type { IChainModule } from '../types';
import type { IOutlineProps } from './outline';
import Outline from './outline';
import type { IResultsProps } from './results';
import Results from './results';
import {
  containerStyle,
  headingStyles,
  modulesContainerStyle,
  outlineStyle,
} from './styles.css';

export interface ISidePanelProps<T> {
  // results: IResultsProps['data'];
  // onResultClick: IResultsProps['onItemClick'];
  // onModuleExpand: IResultsProps['onModuleExpand'];
  // onInterfaceClick: IOutlineProps['onInterfaceClick'];
  // onInterfacesExpand: IOutlineProps['onInterfacesExpand'];
  // selectedModule?: IChainModule;
  data: ICustomTreeProps<T>['data'];
  isLoading?: boolean;
  onReload: ICustomTreeProps<T>['onReload'];
}

// eslint-disable-next-line react/function-component-definition
function SidePanel<T>({ data, onReload }: ISidePanelProps<T>) {
  return (
    <CustomAccordion data={data} defaultExpandedKey="explorer">
      {(item) => (
        <>
          <Stack
            backgroundColor="surface.default"
            justifyContent="space-between"
            alignItems={'center'}
            gap={'xxs'}
          >
            {item.data.title === 'Explorer' ? (
              <MonoVerticalSplit
                style={{ paddingInlineStart: '8px' }}
                // color={
                //   tokens.kda.foundation.color.background.base.default
                // }
                // color={token('color.text.subtle.default')}
              />
            ) : (
              <MonoMenuOpen style={{ paddingInlineStart: '8px' }} />
            )}
            <Heading variant="h6" className={headingStyles}>
              {item.data.title}
            </Heading>
            <Button
              isCompact
              variant="transparent"
              onPress={item.onExpandCollapse}
            >
              {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
            </Button>
          </Stack>
          {item.isExpanded ? (
            <CustomTree data={item.data.children} onReload={onReload} />
          ) : null}
        </>
      )}
    </CustomAccordion>
  );
}

// const SidePanel = ({
//   results,
//   onResultClick,
//   onInterfaceClick,
//   onInterfacesExpand,
//   onModuleExpand,
//   selectedModule,
// }: ISidePanelProps): React.JSX.Element => {
//   const [text, setText] = useState('');
//   const [searchQuery, setSearchQuery] = useState<string>();
//   const [isPending, startTransition] = useTransition();
//   const { t } = useTranslation('common');
//   const { selectedNetwork } = useWalletConnectClient();

//   const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
//     setText(e.target.value);
//     startTransition(() => {
//       setSearchQuery(e.target.value);
//     });
//   };

//   return (
//     <div className={containerStyle}>
//       <div>
//         <TextField
//           label="Search"
//           id="module-explorer-search"
//           placeholder={t('Module name')}
//           onChange={onChange}
//           value={text}
//         />
//       </div>
//       {isPending && <Text>Loading...</Text>}
//       <Results
//         key={`results-${selectedNetwork}`}
//         data={results}
//         filter={searchQuery}
//         onItemClick={onResultClick}
//         onModuleExpand={onModuleExpand}
//         className={modulesContainerStyle}
//       />
//       <Outline
//         selectedModule={selectedModule}
//         className={outlineStyle}
//         onInterfaceClick={onInterfaceClick}
//         onInterfacesExpand={onInterfacesExpand}
//       />
//     </div>
//   );
// };

export default SidePanel;
