import { Confirmation } from '@/components/Confirmation/Confirmation';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { useUser } from '@/hooks/user';
import type { IUserListItem } from '@/utils/store/orgAdminStore';
import { OrgAdminStore } from '@/utils/store/orgAdminStore';
import { MonoAdd, MonoDelete } from '@kadena/kode-icons';
import { Button, Notification, TextField } from '@kadena/kode-ui';
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

  const handleSetUsers = async (users: IUserListItem[]) => {
    //check if we already retrieved info for a user
    setIsLoading(true);

    setUsers(users);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const unlisten = adminstore?.listenToUsers(handleSetUsers);

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

    setIsLoading(false);
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
                  key: 'uid',
                  label: 'Id',
                  width: '30%',
                },
                {
                  key: 'email',
                  label: 'Email',
                  width: '30%',
                },
                {
                  key: 'displayName',
                  label: 'Name',
                  width: '25%',
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
              data={users}
            />

            {!users.length && (
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
