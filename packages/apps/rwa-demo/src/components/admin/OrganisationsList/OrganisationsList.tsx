import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
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
import { useEffect, useState } from 'react';

export const OrganisationsList: FC = () => {
  const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
  const router = useRouter();

  const init = async () => {
    const orgStore = await OrganisationStore();
    if (!orgStore) return;
    const result = await orgStore.getOrganisations();
    setOrganisations(result);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

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
