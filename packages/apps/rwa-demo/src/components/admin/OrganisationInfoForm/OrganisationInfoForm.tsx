import { Confirmation } from '@/components/Confirmation/Confirmation';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { useNotifications } from '@/hooks/notifications';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { RootAdminStore } from '@/utils/store/rootAdminStore';
import { MonoAdd, MonoDelete } from '@kadena/kode-icons';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { OrganisationFormFields } from './OrganisationFormFields';

interface IProps {
  organisationId: IOrganisation['id'];
}

export const OrganisationInfoForm: FC<IProps> = ({ organisationId }) => {
  const [orgStore, setOrgStore] = useState<any>();
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const addDomainRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { addNotification } = useNotifications();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { isValid, errors },
    reset,
  } = useForm<IOrganisation>({
    mode: 'all',
    defaultValues: {
      name: organisation?.name,
      sendEmail: organisation?.sendEmail,
      domains: organisation?.domains ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray<IOrganisation>({
    control,
    name: 'domains',
  });

  useEffect(() => {
    const init = async (organisationId: IOrganisation['id']) => {
      const store = await OrganisationStore(organisationId);
      if (!store) return;
      setOrgStore(store);

      const data = await store.getOrganisation();
      reset(data);
      setOrganisation(data);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(organisationId);
  }, [organisationId]);

  const onSubmit = async (data: IOrganisation) => {
    setIsLoading(true);
    if (!orgStore) return;
    const newOrganisation = { ...organisation, ...data };

    await orgStore.updateOrganisation(newOrganisation);
    setIsLoading(false);
  };

  const handleDelete = useCallback(async () => {
    const rootStore = RootAdminStore();

    if (!rootStore || !organisation?.id) return;
    await rootStore.removeOrganisation(organisation.id);

    addNotification(
      {
        intent: 'positive',
        label: 'Organisation removed',
        message: `Organisation ${organisation.name} has been removed successfully.`,
      },
      {
        name: 'success:submit:removeorganisation',
      },
    );

    router.push('/admin/root');
  }, [organisation?.id]);

  const handleAddDomain = useCallback(() => {
    if (!addDomainRef.current) return;
    append({ value: addDomainRef.current.value });
    reset({ ...getValues() });
    addDomainRef.current.value = '';
  }, [addDomainRef.current, append]);

  if (!organisation) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader title="Organisation Info" />
          <SectionCardBody>
            <OrganisationFormFields control={control} errors={errors} />
          </SectionCardBody>
        </SectionCardContentBlock>
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Domains"
            description={<>Domains that use this app for this organisation</>}
          />
          <SectionCardBody>
            {fields.map((field, index) => {
              const error = (errors.domains ?? [])[index];
              return (
                <Controller
                  name={`domains.${index}.value`}
                  control={control}
                  key={field.id}
                  rules={{
                    required: {
                      value: true,
                      message: 'This field is required',
                    },
                  }}
                  render={({ field }) => (
                    <Stack width="100%" gap="sm" alignItems="center">
                      <TextField
                        {...field}
                        isInvalid={!!error?.message}
                        errorMessage={`${error?.message}`}
                      />
                      <Confirmation
                        onPress={() => remove(index)}
                        trigger={
                          <Button
                            isCompact
                            variant="outlined"
                            startVisual={<MonoDelete />}
                          />
                        }
                      >
                        Are you sure you want to remove this domain?
                      </Confirmation>
                    </Stack>
                  )}
                />
              );
            })}
            <Stack width="100%" gap="sm" alignItems="center">
              <TextField
                name="new"
                ref={addDomainRef}
                defaultValue=""
                placeholder="Fill in a new domain"
              />
              <Button
                isCompact
                variant="outlined"
                startVisual={<MonoAdd />}
                onPress={handleAddDomain}
              />
            </Stack>
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>

      <Stack
        width="100%"
        justifyContent="flex-end"
        marginBlockStart="md"
        gap="md"
      >
        <Confirmation
          onPress={handleDelete}
          trigger={<Button variant="negative">Remove Organisation</Button>}
        >
          Are you sure you want to remove this organisation?
        </Confirmation>

        <Button
          isLoading={isLoading}
          isDisabled={!isValid || isLoading}
          type="submit"
        >
          Edit Organisation
        </Button>
      </Stack>
    </form>
  );
};
