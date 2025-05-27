import { Confirmation } from '@/components/Confirmation/Confirmation';
import { useUser } from '@/hooks/user';
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
  useNotifications,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const RootAdmins: FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const { userToken } = useUser();
  const { addNotification } = useNotifications();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const rootAdminStore = useMemo(() => {
    return RootAdminStore();
  }, []);

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
    console.log({ adminIds });
    const promises = adminIds.map(async (id) => {
      const admin = admins.find((a) => a.uid === id);
      if (!admin) {
        const result = await fetch('/api/admin/user', {
          method: 'POST',
          body: JSON.stringify({
            id,
          }),
          headers: {
            Authorization: `Bearer ${userToken?.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (result.status !== 200) {
          return new Promise((resolve) => resolve(''));
        }

        const d = await result.json();
        console.log(d);
        return d;
      }

      return new Promise((resolve) => resolve(admin));
    });

    const data = (await Promise.all(promises)).filter(Boolean);
    setAdmins(data);
  };

  useEffect(() => {
    if (!rootAdminStore) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const unlisten = rootAdminStore.listenToRootAdmins(handleSetAdmins);

    return unlisten;
  }, [rootAdminStore]);

  const onSubmit = async (data: { email: string }) => {
    if (!userToken) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }
    await rootAdminStore.setAdmin({ email: data.email, token: userToken });
  };

  const handleRemove = async (uid: any) => {
    if (!userToken) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }
    await rootAdminStore.removeAdmin({ uid, token: userToken });
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
              <Button type="submit" isDisabled={!isValid} onClick={() => {}}>
                Make root admin
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Admins"
            description={<>List of all root admins</>}
            actions={
              <>
                <Button
                  onPress={() => {
                    setIsRightAsideExpanded(true);
                  }}
                  isCompact
                  variant="outlined"
                  startVisual={<MonoAdd />}
                >
                  Add admin
                </Button>
              </>
            }
          />
          <SectionCardBody>
            <CompactTable
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
                        Are you sure you want to remove admin rights?
                      </Confirmation>
                    ),
                  }),
                },
              ]}
              data={admins}
            />
          </SectionCardBody>
          <SectionCardBody></SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
