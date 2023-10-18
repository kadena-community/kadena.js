import { Grid, Heading, SelectField, Stack, Tabs } from '@kadena/react-ui';

import type { IChainModule } from './types';

import type {
  KeyboardHandler,
  Mode,
  Theme,
} from '@/components/Global/Ace/helper';
import { keyboards, modes, themes } from '@/components/Global/Ace/helper';
import { usePersistentState } from '@/hooks/use-persistent-state';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

export interface IEditorProps {
  openedModules: IChainModule[];
}

const moduleToTabId = ({ moduleName, chainId }: IChainModule): string => {
  return `${moduleName}-${chainId}`;
};

const Editor = ({ openedModules }: IEditorProps): React.JSX.Element => {
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
            'Click on a module from the left panel to see its code in this panel.',
          )}
        </p>
      </section>
    );
  }
  return (
    <Stack direction={'column'}>
      <Grid.Root columns={3}>
        <Grid.Item>
          <SelectField
            label={t('Keyboard handler')}
            selectProps={{
              id: 'editor-keyboard-select',
              ariaLabel: t('Select which keyboard to use for the code editor'),
              onChange: (e) => {
                setKeyboardHandler(e.target.value as KeyboardHandler);
              },
            }}
          >
            {keyboards.map((keyboard) => (
              <option key={`editor-keyboard-${keyboard}`}>{keyboard}</option>
            ))}
          </SelectField>
        </Grid.Item>
        <Grid.Item>
          <SelectField
            label={t('Theme')}
            selectProps={{
              id: 'editor-theme-select',
              ariaLabel: t('Select which theme to use for the code editor'),
              onChange: (e) => {
                setTheme(e.target.value as Theme);
              },
            }}
          >
            {themes.map((theme) => (
              <option key={`editor-theme-${theme}`}>{theme}</option>
            ))}
          </SelectField>
        </Grid.Item>
        <Grid.Item>
          <SelectField
            label={t('Mode')}
            selectProps={{
              id: 'editor-mode-select',
              ariaLabel: t('Select which mode to use for the code editor'),
              onChange: (e) => {
                setMode(e.target.value as Mode);
              },
            }}
          >
            {modes.map((mode) => (
              <option key={`editor-mode-${mode}`}>{mode}</option>
            ))}
          </SelectField>
        </Grid.Item>
      </Grid.Root>
      <Tabs.Root initialTab={moduleToTabId(openedModules[0])}>
        {openedModules.map(({ moduleName, chainId }) => {
          return (
            <Tabs.Tab
              id={moduleToTabId({ moduleName, chainId })}
              key={moduleToTabId({ moduleName, chainId })}
            >{`${moduleName} @ ${chainId}`}</Tabs.Tab>
          );
        })}

        {openedModules.map(({ moduleName, chainId, code }) => {
          return (
            <Tabs.Content
              key={moduleToTabId({ moduleName, chainId })}
              id={moduleToTabId({ moduleName, chainId })}
            >
              <AceViewer
                code={code}
                width="100%"
                readOnly={false}
                keyboardHandler={keyboardHandler}
                theme={theme}
                mode={mode}
              />
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    </Stack>
  );
};

export default Editor;
