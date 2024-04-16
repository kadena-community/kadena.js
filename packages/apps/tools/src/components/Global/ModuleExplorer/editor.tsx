import {
  Button,
  Grid,
  GridItem,
  Heading,
  Select,
  SelectItem,
  Stack,
  TabItem,
  Tabs,
} from '@kadena/react-ui';

import type { IChainModule } from './types';

import type {
  KeyboardHandler,
  Mode,
  Theme,
} from '@/components/Global/Ace/helper';
import { keyboards, modes, themes } from '@/components/Global/Ace/helper';
import { usePersistentState } from '@/hooks/use-persistent-state';
import { MonoClose } from '@kadena/react-icons/system';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

export interface IEditorProps {
  openedModules: IChainModule[];
  onActiveModuleChange: (module: IChainModule) => void;
  onTabClose: (module: IChainModule) => void;
  activeModule?: IChainModule;
}

const moduleToTabId = ({ moduleName, chainId }: IChainModule): string => {
  return `${moduleName}-${chainId}`;
};

const Editor = ({
  openedModules,
  onActiveModuleChange,
  onTabClose,
  activeModule,
}: IEditorProps): React.JSX.Element => {
  const { t } = useTranslation('common');
  const [keyboardHandler, setKeyboardHandler] =
    usePersistentState<KeyboardHandler>('keyboard-handler', keyboards[0]);
  const [theme, setTheme] = usePersistentState<Theme>('theme', 'monokai');
  const [mode, setMode] = usePersistentState<Mode>('mode', 'lisp');

  if (!openedModules.length) {
    return (
      <section>
        <Heading variant="h4">{t('No code to be shown yet')}</Heading>
        <p>
          {t(
            'Click on a module from the left panel to see its code in this panel',
          )}
        </p>
      </section>
    );
  }
  return (
    <Stack flexDirection={'column'}>
      <Grid columns={3}>
        <GridItem>
          <Select
            label={t('Keyboard handler')}
            id="editor-keyboard-handler"
            aria-label={t('Select which keyboard to use for the code editor')}
            onSelectionChange={(key) => {
              setKeyboardHandler(key.toString() as KeyboardHandler);
            }}
          >
            {keyboards.map((keyboard) => (
              <SelectItem key={keyboard}>{keyboard}</SelectItem>
            ))}
          </Select>
        </GridItem>
        <GridItem>
          <Select
            label={t('Theme')}
            id="editor-theme-select"
            aria-label={t('Select which theme to use for the code editor')}
            onSelectionChange={(key) => {
              setTheme(key.toString() as Theme);
            }}
          >
            {themes.map((theme) => (
              <SelectItem key={theme}>{theme}</SelectItem>
            ))}
          </Select>
        </GridItem>
        <GridItem>
          <Select
            label={t('Mode')}
            id="editor-mode-select"
            aria-label={t('Select which mode to use for the code editor')}
            onSelectionChange={(key) => {
              setMode(key.toString() as Mode);
            }}
          >
            {modes.map((mode) => (
              <SelectItem key={mode}>{mode}</SelectItem>
            ))}
          </Select>
        </GridItem>
      </Grid>
      <Tabs
        selectedKey={activeModule ? moduleToTabId(activeModule) : null}
        onSelectionChange={(key) => {
          const activeModule = openedModules.find((module) => {
            return moduleToTabId(module) === key;
          });
          if (activeModule) {
            onActiveModuleChange(activeModule);
          }
        }}
      >
        {openedModules.map((module) => {
          const { moduleName, chainId, code } = module;
          return (
            <TabItem
              title={`${moduleName} @ ${chainId}`}
              key={moduleToTabId({ moduleName, chainId })}
            >
              <Button
                onPress={() => {
                  onTabClose(module);
                }}
                isCompact
                // endIcon={<MonoClose />}
              >
                Close
              </Button>
              <AceViewer
                code={code}
                width="100%"
                readOnly={false}
                keyboardHandler={keyboardHandler}
                theme={theme}
                mode={mode}
              />
            </TabItem>
          );
        })}
      </Tabs>
    </Stack>
  );
};

export default Editor;
