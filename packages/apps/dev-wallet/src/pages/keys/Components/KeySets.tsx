import { FormatKeys } from '@/Components/Table/FormatKeys';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Button, Notification, NotificationHeading } from '@kadena/kode-ui';
import {
  CompactTable,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { CreateKeySetForm } from './CreateKeySetForm';

export function KeySets() {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const { keysets } = useWallet();
  return (
    <>
      <CreateKeySetForm
        isOpen={isRightAsideExpanded}
        close={() => setIsRightAsideExpanded(false)}
      />

      <SectionCard stack="vertical" variant="main">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Key Sets"
            actions={
              <Button
                onPress={() => setIsRightAsideExpanded(true)}
                variant="outlined"
                isCompact
              >
                Create Key Set
              </Button>
            }
          />
          <SectionCardBody>
            {keysets?.length > 0 ? (
              <CompactTable
                variant="open"
                fields={[
                  {
                    label: 'Alias',
                    key: 'alias',
                    width: '10%',
                  },
                  {
                    label: 'Principal',
                    key: 'principal',
                    width: '45%',
                  },
                  {
                    label: 'Keys',
                    key: ['guard.pred', 'guard.keys'],
                    variant: 'code',
                    width: '45%',
                    render: FormatKeys(),
                  },
                ]}
                data={keysets.filter(({ guard }) => guard.keys.length >= 2)}
              />
            ) : (
              <Notification
                intent="info"
                isDismissable={false}
                role="alert"
                type="inlineStacked"
              >
                <NotificationHeading>
                  No keysets created yet
                </NotificationHeading>
              </Notification>
            )}
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
}
