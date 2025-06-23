import { useAccount } from '@/hooks/account';
import { useUser } from '@/hooks/user';
import { Badge, maskValue, Stack, Text } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { CopyButton } from '../CopyButton/CopyButton';
import { AliasForm } from '../Forms/AliasForm/AliasForm';
import { formatAliasEditClass } from './style.css';

export interface IActionProps {}

export const FormatAccount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const { findAliasByAddress } = useUser();
    const { accounts } = useAccount();
    const [isAliasFormOpen, setIsAliasFormOpen] = useState(false);
    const { setIsRightAsideExpanded } = useSideBarLayout();

    useEffect(() => {
      setIsRightAsideExpanded(isAliasFormOpen);
    }, [isAliasFormOpen]);

    const displayName = findAliasByAddress(`${value}`);

    const handleClose = () => {
      setIsAliasFormOpen(false);
    };

    const isMyAccount = accounts?.map((a) => a.address).includes(`${value}`);

    return (
      <>
        {isAliasFormOpen && (
          <RightAside isOpen onClose={handleClose}>
            <RightAsideHeader label="Edit Alias" />
            <RightAsideContent>
              <Text>
                You can set an alias for this account to make it easier to
                recognize. This alias will be used in the UI toghether with the
                account address.
              </Text>
              <Text>
                Other people will not see this alias, it is only for your
                convenience.
              </Text>
              <Stack marginBlockStart="md" width="100%">
                <AliasForm accountName={`${value}`} onDone={handleClose} />
              </Stack>
            </RightAsideContent>
          </RightAside>
        )}
        <Stack flexDirection="column" className="accountwrapperclass">
          <Stack gap="xs" alignItems="center">
            <Text variant="code">{maskValue(`${value}`)} </Text>
            <CopyButton value={`${value}`} />
            {isMyAccount && (
              <Badge style="positive" size="sm">
                Me
              </Badge>
            )}
          </Stack>
          <Stack gap="xs" alignItems="center">
            {displayName && (
              <Text size="smallest">{displayName ? displayName : ''}</Text>
            )}

            <Stack
              as="a"
              onClick={() => {
                setIsAliasFormOpen(true);
              }}
              className={formatAliasEditClass}
            >
              <Text size="smallest">{displayName ? 'Edit' : 'Add'} alias</Text>
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  };
  return Component;
};
