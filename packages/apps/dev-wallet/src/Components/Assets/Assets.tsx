import { useRightAside } from '@/App/Layout/useRightAside';
import { Fungible, IOwnedAccount } from '@/modules/account/account.repository';
import { Button, Heading } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import { useMemo } from 'react';
import { AddTokenForm } from './AddTokenForm';
import { AssetCards } from './AssetCards';

export function Assets({
  selectedContract,
  setSelectedContract,
  accounts,
  fungibles,
  showAddToken = false,
}: {
  selectedContract: string;
  setSelectedContract: (contract: string) => void;
  accounts: IOwnedAccount[];
  fungibles: Fungible[];
  showAddToken?: boolean;
}) {
  const [isAssetFormExpanded, expandAssetForm, closeAssetForm] =
    useRightAside();
  const assets = useMemo(() => {
    return fungibles.map((item) => {
      const acs = accounts.filter((a) => a.contract === item.contract);
      return {
        ...item,
        accounts: acs,
        balance: acs
          .reduce((acc, a) => acc.plus(a.overallBalance), new PactNumber(0))
          .toDecimal(),
      } as unknown as Fungible & { balance: number };
    });
  }, [accounts, fungibles]);

  return (
    <>
      <AddTokenForm isOpen={isAssetFormExpanded} onClose={closeAssetForm} />
      <SectionCard stack="horizontal">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Your Assets"
            description={<></>}
            actions={
              showAddToken ? (
                <Button
                  variant="outlined"
                  isCompact
                  onPress={() => {
                    expandAssetForm();
                  }}
                >
                  Add new asset
                </Button>
              ) : (
                <></>
              )
            }
          />
          <SectionCardBody>
            <Heading as="h5">Available Assets</Heading>

            <AssetCards
              assets={assets}
              selectedContract={selectedContract}
              onClick={setSelectedContract}
            />
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
}
