import { Confirmation } from '@/components/Confirmation/Confirmation';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { useUser } from '@/hooks/user';
import type { IUserListItem } from '@/utils/store/orgAdminStore';
import { OrgAdminStore } from '@/utils/store/orgAdminStore';
import { MonoAdd, MonoDelete, MonoVerified } from '@kadena/kode-icons';
import {
  Badge,
  Button,
  Notification,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
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
  useNotifications,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const loadingData: IUserListItem[] = Array.from({ length: 3 }, (_, i) => ({
  uid: '',
  email: '',
  emailVerified: false,
  isOrgAdmin: false,
  rootAdmin: false,
}));

export const UsersList: FC<{ organisationId?: IOrganisation['id'] }> = ({
  organisationId,
}) => {
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useUser();
  const { addNotification } = useNotifications();

  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const adminstore = useMemo(() => {
    if (!organisationId) return;
    return OrgAdminStore(organisationId);
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

  const loadData = async () => {
    setIsLoading(true);
    if (!adminstore || !organisationId || !userToken) return;
    // Listen to the user list
    const result = await adminstore.getUserList(userToken);
    if (result.status !== 200) {
      addNotification({
        intent: 'negative',
        label: 'Failed to load users',
        message: result?.statusText || 'Unknown error',
      });
      setIsLoading(false);
      return;
    }

    const data = await result.json();

    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadData();
  }, [adminstore, organisationId, userToken]);

  const addAdminIsAllowed = useMemo(() => {
    return (
      userToken?.claims.rootAdmin ||
      (organisationId && (userToken?.claims.orgAdmins as any)[organisationId])
    );
  }, [userToken, organisationId]);

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    if (!userToken || !adminstore) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }
    const result = await adminstore.setUser({
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

    await loadData();
    setIsRightAsideExpanded(false);
  };

  const handleRemove = async (uid: any) => {
    setIsLoading(true);
    if (!userToken || !adminstore) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }

    const result = await adminstore.removeUser({ uid, token: userToken });

    if (result.status !== 200) {
      const data = await result.json();
      addNotification({
        intent: 'negative',
        label: 'admin not removed',
        message: data.message,
      });
    }

    await loadData();
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
            <RightAsideHeader label="Invite User" />
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
                Invite User
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Users"
            description={<>List of all users</>}
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
                  invite user
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
                  key: 'emailVerified',
                  label: 'Verified',
                  width: '15%',
                  render: ({ value }: { value: string }) => (
                    <span>
                      {value ? (
                        <MonoVerified />
                      ) : (
                        <span style={{ opacity: '.2' }}>
                          <MonoVerified />
                        </span>
                      )}
                    </span>
                  ),
                },
                {
                  key: ['email', 'isOrgAdmin'],
                  label: 'Verified',
                  width: '70%',
                  render: ({ value: [email, isOrgAdmin] }: any) => (
                    <Stack gap="xs" alignItems="center">
                      <Text variant="code">{email}</Text>

                      {Boolean(isOrgAdmin) && (
                        <Badge size="sm" style="info">
                          Org Admin
                        </Badge>
                      )}
                    </Stack>
                  ),
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
                        Are you sure you want to remove this users?
                      </Confirmation>
                    ),
                  }),
                },
              ]}
              data={isLoading ? loadingData : users}
            />

            {!users.length && !isLoading && (
              <Notification role="status" type="inlineStacked" intent="info">
                No users yet
              </Notification>
            )}
          </SectionCardBody>
          <SectionCardBody></SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
