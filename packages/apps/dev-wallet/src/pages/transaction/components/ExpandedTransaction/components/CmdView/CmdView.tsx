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
  return (
    <Tabs>
      {views.map(
        (view) =>
          view.data && (
            <TabItem key={view.label} title={view.label}>
              <JsonView title={view.label} data={view.data} />
            </TabItem>
          ),
      )}
    </Tabs>
  );
};
