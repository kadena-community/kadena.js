import { Heading, Stack, Text } from '@kadena/react-ui';

import { useTheme } from 'next-themes';

import type {
  EditingMode,
  KeyboardHandler,
  Mode,
} from '@/components/Global/Ace/helper';
import { keyboards } from '@/components/Global/Ace/helper';
import type { ModuleModel } from '@/hooks/use-module-query';
import { usePersistentState } from '@/hooks/use-persistent-state';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import React from 'react';
import StatusBar from './statusbar';
import { placeholderBodyStyles } from './styles.css';
import type { ITabsProps } from './tabs';
import Tabs from './tabs';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

export interface IEditorProps {
  openedModules: ModuleModel[];
  onActiveModuleChange: (module: ModuleModel) => void;
  activeModule?: ModuleModel;
  onModuleTabClose: ITabsProps['onModuleTabClose'];
  onChainTabClose: ITabsProps['onChainTabClose'];
}

const Editor = ({
  openedModules,
  onActiveModuleChange,
  activeModule,
  onModuleTabClose,
  onChainTabClose,
}: IEditorProps): React.JSX.Element => {
  const { t } = useTranslation('common');
  const [keyboardHandler] = usePersistentState<KeyboardHandler>(
    'keyboard-handler',
    keyboards[0],
  );
  // @TODO: This will be re-enabled again in the near future
  // const [theme, setTheme] = usePersistentState<Theme>('theme', 'monokai');
  const [mode] = usePersistentState<Mode>('mode', 'lisp');
  const [editingMode] = usePersistentState<EditingMode>(
    'editing-mode',
    'disabled',
  );

  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const aceTheme = currentTheme === 'dark' ? 'github_dark' : 'github';

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
        onChainTabClose={onChainTabClose}
        onModuleTabClose={onModuleTabClose}
        openedModules={openedModules}
        activeModule={activeModule}
        onModuleChange={onActiveModuleChange}
      />
      <div style={{ flex: 1 }}>
        <AceViewer
          code={activeModule.code}
          readOnly={editingMode === 'disabled'}
          keyboardHandler={keyboardHandler}
          theme={aceTheme}
          mode={mode}
        />
      </div>
      <StatusBar module={activeModule} />
    </Stack>
  );
};

export default Editor;
