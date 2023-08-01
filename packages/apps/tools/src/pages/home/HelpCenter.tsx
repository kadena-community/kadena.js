import { SystemIcon } from '@kadena/react-ui';

import DrawerToolbar from '@/components/Common/DrawerToolbar';
import ResourceLinks from '@/components/Global/ResourceLinks';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

const HelpCenter: FC = () => {
  const { t } = useTranslation('common');
  return (
    <DrawerToolbar
      sections={[
        {
          icon: SystemIcon.HelpCircle,
          title: t('Help Center'),
          children: (
            <>
              <p>
                Blockchain transactions are irreversible. If you make a mistake,
                your coins may not be recoverable. Before you transfer large
                sums, it is always best to do a small test transaction first and
                then send those coins back to the sender to verify that the
                receiver account works as expected.
              </p>
              <ResourceLinks
                links={[
                  { title: 'Pact Language Resources', href: '#' },
                  { title: 'Whitepaper', href: '#' },
                  { title: 'KadenaJs', href: '#' },
                ]}
              />
            </>
          ),
        },
      ]}
    />
  );
};

export default HelpCenter;
