import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { MonoAdd, MonoFindInPage } from '@kadena/kode-icons';
import { Button, RightAsideFooter } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OrganisationFormFields } from '../OrganisationInfoForm/OrganisationFormFields';

const loadingData: IOrganisation[] = Array.from({ length: 3 }, (_, i) => ({
  id: '',
  name: '',
  domains: [],
  sendEmail: '',
}));

export const OrganisationsList: FC = () => {
  const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isValid, errors },
    reset,
  } = useForm<IOrganisation>({
    mode: 'all',
    defaultValues: {
      name: '',
      sendEmail: '',
      domains: [],
    },
  });

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
    <>
      {isRightAsideExpanded && isAddOpen && (
        <RightAside
          isOpen
          onClose={() => {
            setIsAddOpen(false);
            setIsRightAsideExpanded(false);
          }}
        >
          <form>
            <RightAsideHeader label="Add Organisation" />
            <RightAsideContent>
              <OrganisationFormFields control={control} errors={errors} />
            </RightAsideContent>
            <RightAsideFooter>
              <Button type="submit">Create Organisation</Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Organisations"
            actions={
              <Button
                isCompact
                variant="outlined"
                endVisual={<MonoAdd />}
                onPress={() => {
                  setIsAddOpen(true);
                  setIsRightAsideExpanded(true);
                }}
              >
                Add organisation
              </Button>
            }
          />

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
    </>
  );
};
