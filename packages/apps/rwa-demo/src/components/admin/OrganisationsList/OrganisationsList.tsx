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

const loadingData: IOrganisation[] = Array.from({ length: 3 }, (_, i) => ({
  id: '',
  name: '',
  domains: [],
  sendEmail: '',
}));

export const OrganisationsList: FC = () => {
  const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const orgStore = await OrganisationStore();
      if (!orgStore) return;
      const result = await orgStore.getOrganisations();
      setOrganisations(result);
      setIsLoading(false);
    };

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
            isLoading={isLoading}
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
            data={isLoading ? loadingData : organisations}
          />
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
