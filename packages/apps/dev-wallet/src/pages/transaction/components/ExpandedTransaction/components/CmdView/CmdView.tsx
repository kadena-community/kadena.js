import { TerminalCard } from '@/Components/TerminalCard/TerminalCard';
import { TabItem, Tabs } from '@kadena/kode-ui';
import { FC } from 'react';
import { JsonView } from '../../JsonView';

interface IProps {
  views: {
    label: string;
    data?: any;
  }[];
}

export const CmdView: FC<IProps> = ({ views }) => {
  const showData = views.some((view) => view.data);

  if (!showData) return null;
  return (
    <TerminalCard>
      <Tabs isCompact>
        {views.map(
          (view) =>
            view.data && (
              <TabItem key={view.label} title={view.label}>
                <JsonView title={view.label} data={view.data} />
              </TabItem>
            ),
        )}
      </Tabs>
    </TerminalCard>
  );
};
