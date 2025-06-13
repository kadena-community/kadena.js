import { Confirmation } from '@/components/Confirmation/Confirmation';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { useNotifications } from '@/hooks/notifications';
import { useUser } from '@/hooks/user';
import { OrgAdminStore } from '@/utils/store/orgAdminStore';
import { RootAdminStore } from '@/utils/store/rootAdminStore';
import { MonoAdd, MonoDelete } from '@kadena/kode-icons';
import { Button, TextField } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const loadingData = [
  {
    id: '',
    email: '',
    displayName: '',
  },
  {
    id: '',
    email: '',
    displayName: '',
  },
  {
    id: '',
    email: '',
    displayName: '',
  },
];

export const AdminsList: FC<{ organisationId?: IOrganisation['id'] }> = ({
  organisationId,
}) => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useUser();
  const { addNotification } = useNotifications();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const adminstore = useMemo(() => {
    if (organisationId) {
      return OrgAdminStore(organisationId);
    }
    return RootAdminStore();
  }, [organisationId]);

  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<{ email: string }>({
    mode: 'all',
    defaultValues: {
      email: '',
    },
  });

  const handleSetAdmins = async (adminIds: string[]) => {
    //check if we already retrieved info for a user
    setIsLoading(true);
    const promises = adminIds.map(async (id) => {
      const admin = admins.find((a) => a.uid === id);
      if (!admin) {
        const result = await fetch(
          `/api/admin/user?organisationId=${organisationId ? organisationId : ''}&uid=${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userToken?.token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (result.status !== 200) {
          return new Promise((resolve) => resolve(''));
        }

        const d = await result.json();
        return d;
      }

      return new Promise((resolve) => resolve(admin));
    });

    const data = (await Promise.all(promises)).filter(Boolean);
    setAdmins(data);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const unlisten = adminstore.listenToAdmins(handleSetAdmins);

    return unlisten;
  }, [adminstore, organisationId]);

  const addAdminIsAllowed = useMemo(() => {
    return (
      userToken?.claims.rootAdmin ||
      (organisationId && (userToken?.claims.orgAdmins as any)[organisationId])
    );
  }, [userToken, organisationId]);

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    if (!userToken) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }
    const result = await adminstore.setAdmin({
      email: data.email,
      token: userToken,
    });

    if (result.status !== 200) {
      addNotification({
        intent: 'negative',
        label: 'admin not added',
        message: result.statusText,
      });
    }

    setIsLoading(false);
    setIsRightAsideExpanded(false);
  };

  const handleRemove = async (uid: any) => {
    setIsLoading(true);
    if (!userToken) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }

    const result = await adminstore.removeAdmin({ uid, token: userToken });

    if (result.status !== 200) {
      const data = await result.json();
      addNotification({
        intent: 'negative',
        label: 'admin not removed',
        message: data.message,
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      {isRightAsideExpanded && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Add admin" />
            <RightAsideContent>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email regex
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    id="email"
                    isInvalid={!!errors.email?.message}
                    errorMessage={`${errors.email?.message}`}
                    label="Email"
                    {...field}
                  />
                )}
              />
            </RightAsideContent>
            <RightAsideFooter>
              <Button
                variant="transparent"
                onClick={() => {
                  setIsRightAsideExpanded(false);
                }}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                type="submit"
                isDisabled={!isValid || isLoading || !addAdminIsAllowed}
                onClick={() => {}}
              >
                Make admin
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Admins"
            description={<>List of all admins</>}
            actions={
              <>
                <Button
                  onPress={() => {
                    setIsRightAsideExpanded(true);
                  }}
                  isCompact
                  variant="outlined"
                  isDisabled={!addAdminIsAllowed}
                  startVisual={<MonoAdd />}
                >
                  Add admin
                </Button>
              </>
            }
          />
          <SectionCardBody>
            <CompactTable
              isLoading={isLoading}
              variant="open"
              fields={[
                {
                  key: 'uid',
                  label: 'Id',
                  width: '30%',
                },
                {
                  key: 'email',
                  label: 'Email',
                  width: '55%',
                },

                {
                  label: '',
                  key: 'uid',
                  width: '15%',
                  align: 'end',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Confirmation
                        onPress={handleRemove}
                        trigger={
                          <Button
                            isCompact
                            variant="outlined"
                            startVisual={<MonoDelete />}
                          />
                        }
                      >
                        Are you sure you want to remove admin rights?
                      </Confirmation>
                    ),
                  }),
                },
              ]}
              data={isLoading ? loadingData : admins}
            />
          </SectionCardBody>
          <SectionCardBody></SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
