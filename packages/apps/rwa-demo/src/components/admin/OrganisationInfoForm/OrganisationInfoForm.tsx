import { Confirmation } from '@/components/Confirmation/Confirmation';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { useNotifications } from '@/hooks/notifications';
import { useUser } from '@/hooks/user';
import { cleanupOrigin } from '@/utils/getOriginKey';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { RootAdminStore } from '@/utils/store/rootAdminStore';
import { MonoDelete } from '@kadena/kode-icons';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { OrganisationFormFields } from './OrganisationFormFields';
import type { Action } from './reducer';
import { domainsReducer } from './reducer';

interface IProps {
  organisationId: IOrganisation['id'];
}

type IOrganisationWithNewDomain = IOrganisation & {
  newDomain?: string;
};

export const OrganisationInfoForm: FC<IProps> = ({ organisationId }) => {
  const [domains, dispatchDomains] = useReducer<string[], [Action]>(
    domainsReducer,
    [],
  );

  const [orgStore, setOrgStore] = useState<any>();
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const [newDomainValue, setNewDomainValue] = useState('');
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { userToken } = useUser();
  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
    reset,
  } = useForm<IOrganisationWithNewDomain>({
    mode: 'all',
    defaultValues: {
      name: organisation?.name,
      sendEmail: organisation?.sendEmail,
      domains: organisation?.domains ?? [],
      newDomain: '',
    },
  });

  const { fields, remove } = useFieldArray<IOrganisationWithNewDomain>({
    control,
    name: 'domains',
  });

  useEffect(() => {
    const init = async (organisationId: IOrganisation['id']) => {
      const store = await OrganisationStore(organisationId);
      const rootStore = RootAdminStore();
      if (!store) return;
      setOrgStore(store);

      const data = await store.getOrganisation();

      //getall domains for validation of domains
      const allDomains = await rootStore.getAllDomains();

      dispatchDomains({
        type: 'init',
        payload: allDomains,
      });

      reset(data);
      setOrganisation(data);
      setReload(false);
    };

    if (reload === false) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(organisationId);
  }, [organisationId, reload]);

  const onSubmit = async (data: IOrganisationWithNewDomain) => {
    setIsLoading(true);
    if (!orgStore) return;
    // remove the newDomain field from the data object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { newDomain, ...cleanedData } = data;
    const newOrganisation = {
      ...organisation,
      ...cleanedData,
      domains: newDomain
        ? [...data.domains, { value: cleanupOrigin(newDomain) }]
        : data.domains,
    };

    await orgStore.updateOrganisation(newOrganisation);
    setIsLoading(false);
    setReload(true);
    addNotification({
      intent: 'positive',
      label: 'Organisation updated',
      message: `Organisation ${newOrganisation.name} has been updated successfully.`,
    });
    setNewDomainValue('');
  };

  const handleDelete = useCallback(async () => {
    const rootStore = RootAdminStore();

    if (!rootStore || !organisation?.id) return;
    await rootStore.removeOrganisation(organisation.id);

    addNotification(
      {
        intent: 'warning',
        label: 'Organisation removed',
        message: `Organisation ${organisation.name} has been removed successfully.`,
      },
      {
        name: 'success:submit:removeorganisation',
      },
    );

    router.push('/admin/root');
  }, [organisation?.id]);

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

          {userToken?.claims.rootAdmin ? (
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
                      validate: (value) => {
                        const pattern =
                          /^(https?:\/\/)[^\s\/$.?#].[^\s]*[^\/\s]$/i;
                        if (!pattern.test(value)) {
                          return 'Invalid domain format. Use a valid URL format. Do not end with a /';
                        }

                        if (domains.includes(value) && value !== field.value) {
                          return 'This domain already exists';
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <Stack width="100%" gap="sm" alignItems="flex-start">
                        <TextField
                          {...field}
                          isDisabled
                          isInvalid={!!error?.value?.message}
                          errorMessage={`${error?.value?.message}`}
                        />
                        <Confirmation
                          onPress={() => {
                            dispatchDomains({
                              type: 'remove',
                              payload: field.value,
                            });

                            remove(index);
                          }}
                          trigger={
                            <Button
                              aria-label="Remove domain"
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

              <Stack width="100%" gap="sm" alignItems="flex-start">
                <Controller
                  name="newDomain"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value) return true;
                      const pattern =
                        /^(https?:\/\/)[^\s\/$.?#].[^\s]*[^\/\s]$/i;
                      if (!pattern.test(value)) {
                        return 'Invalid domain format. Use a valid URL format. Do not end with a /';
                      }

                      if (domains.includes(value)) {
                        return 'This domain already exists';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      key={field.name}
                      defaultValue=""
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setNewDomainValue(e.target.value);
                      }}
                      isInvalid={!!errors.newDomain?.message}
                      errorMessage={`${errors.newDomain?.message}`}
                      value={newDomainValue}
                      placeholder="Fill in a new domain"
                    />
                  )}
                />
              </Stack>
            </SectionCardBody>
          ) : null}
        </SectionCardContentBlock>
      </SectionCard>

      <Stack
        width="100%"
        justifyContent="flex-end"
        marginBlockStart="md"
        gap="md"
      >
        {userToken?.claims.rootAdmin ? (
          <Confirmation
            onPress={handleDelete}
            trigger={<Button variant="negative">Remove Organisation</Button>}
          >
            Are you sure you want to remove this organisation?
          </Confirmation>
        ) : null}

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
