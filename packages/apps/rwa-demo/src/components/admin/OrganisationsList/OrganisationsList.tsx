import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { MonoFindInPage } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

export const OrganisationsList: FC = () => {
  const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
  const router = useRouter();

  const orgStore = useMemo(() => {
    const id = localStorage.getItem(getLocalStorageKey('orgId')) ?? '';
    return OrganisationStore(id);
  }, []);

  const init = async () => {
    const result = await orgStore.getOrganisations();
    console.log(result);
    setOrganisations(result);
  };

  useEffect(() => {
    if (!orgStore) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [orgStore]);

  const handleLink = (id: any) => {
    router.push(`/admin/root/organisation/${id}`);
  };

  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader title="Organisations" />

        <SectionCardBody>
          <CompactTable
            variant="open"
            fields={[
              { key: 'name', label: 'name', width: '85%' },
              {
                label: '',
                key: 'id',
                width: '15%',
                align: 'end',
                render: CompactTableFormatters.FormatActions({
                  trigger: (
                    <Button
                      isCompact
                      variant="outlined"
                      startVisual={<MonoFindInPage />}
                      onPress={handleLink}
                    />
                  ),
                }),
              },
            ]}
            data={organisations}
          />
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
