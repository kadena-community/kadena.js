import {
  Button,
  Grid,
  GridItem,
  Heading,
  Select,
  SelectItem,
  Stack,
  TabItem,
  Text,
} from '@kadena/react-ui';

import type { IChainModule } from './types';

import type {
  EditingMode,
  KeyboardHandler,
  Mode,
  Theme,
} from '@/components/Global/Ace/helper';
import {
  editingModes,
  keyboards,
  modes,
  themes,
} from '@/components/Global/Ace/helper';
import type { ModuleModel } from '@/hooks/use-module-query';
import { usePersistentState } from '@/hooks/use-persistent-state';
import { MonoClose } from '@kadena/react-icons/system';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import React from 'react';
import StatusBar from './statusbar';
import { placeholderBodyStyles } from './styles.css';
import Tabs from './tabs';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

export interface IEditorProps {
  openedModules: ModuleModel[];
  onActiveModuleChange: (module: ModuleModel) => void;
  onTabClose: (module: ModuleModel) => void;
  activeModule?: ModuleModel;
}

const moduleToTabId = ({
  moduleName,
  chainId,
  network,
}: IChainModule): string => {
  return `${moduleName}-${chainId}-${network}`;
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
  const [editingMode, setEditingMode] = usePersistentState<EditingMode>(
    'editing-mode',
    'disabled',
  );

  if (!openedModules.length || !activeModule) {
    return (
      <Stack
        as="section"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading>{t('no-selected-module-header')}</Heading>
        <Text className={placeholderBodyStyles}>
          {t('no-selected-module-body')}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack flexDirection={'column'} justifyContent={'space-between'}>
      <Tabs
        openedModules={openedModules}
        activeModule={activeModule}
        onModuleChange={onActiveModuleChange}
      />
      <div style={{ flex: 1 }}>
        <AceViewer
          code={activeModule.code}
          width="100%"
          readOnly={editingMode === 'disabled'}
          keyboardHandler={keyboardHandler}
          theme={theme}
          mode={mode}
        />
      </div>
      <StatusBar module={activeModule} />
    </Stack>
  );

  return (
    <Stack flexDirection={'column'}>
      <Grid columns={4}>
        <GridItem>
          <Select
            label={t('Keyboard handler')}
            id="editor-keyboard-handler"
            aria-label={t('Select which keyboard to use for the code editor')}
            selectedKey={keyboardHandler}
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
            selectedKey={theme}
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
            selectedKey={mode}
            onSelectionChange={(key) => {
              setMode(key.toString() as Mode);
            }}
          >
            {modes.map((mode) => (
              <SelectItem key={mode}>{mode}</SelectItem>
            ))}
          </Select>
        </GridItem>
        <GridItem>
          <Select
            label={t('Editing')}
            id="editor-editing-mode-select"
            aria-label={t(
              'Select whether to enable/disable editing for the code editor',
            )}
            selectedKey={`editing-${editingMode}`}
            onSelectionChange={(key) => {
              const [, mode] = key.toString().split('-');
              setEditingMode(mode as EditingMode);
            }}
          >
            {editingModes.map((mode) => (
              <SelectItem key={`editing-${mode}`}>{mode}</SelectItem>
            ))}
          </Select>
        </GridItem>
      </Grid>
      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={(key) => {
          setSelectedKey(key as string);

          const activeModule = openedModules.find((module) => {
            return moduleToTabId(module) === key;
          });
          if (activeModule) {
            onActiveModuleChange(activeModule);
          }
        }}
      >
        {openedModules.map((module) => {
          const { moduleName, chainId, code, network } = module;
          return (
            <TabItem
              title={`${moduleName} @ ${chainId}`}
              key={moduleToTabId({ moduleName, chainId, network })}
            >
              <Button
                onPress={() => {
                  onTabClose(module);
                }}
                isCompact
                endVisual={<MonoClose />}
              >
                Close
              </Button>
              <AceViewer
                code={code}
                width="100%"
                readOnly={editingMode === 'disabled'}
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
