import { useUser } from '@/hooks/user';
import { maskValue, Stack, Text } from '@kadena/kode-ui';
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
import { formatAliasEditClass, formatAliasWrapperClass } from './style.css';

export interface IActionProps {}

export const FormatAccount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const { findAliasByAddress } = useUser();
    const [isAliasFormOpen, setIsAliasFormOpen] = useState(false);
    const { setIsRightAsideExpanded } = useSideBarLayout();

    useEffect(() => {
      setIsRightAsideExpanded(isAliasFormOpen);
    }, [isAliasFormOpen]);

    const displayName = findAliasByAddress(`${value}`);
    return (
      <>
        {isAliasFormOpen && (
          <RightAside
            isOpen
            onClose={() => {
              setIsAliasFormOpen(false);
            }}
          >
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
                <AliasForm accountName={`${value}`} />
              </Stack>
            </RightAsideContent>
          </RightAside>
        )}
        <Stack flexDirection="column">
          <Stack gap="xs" alignItems="center">
            <Text variant="code">{maskValue(`${value}`)}</Text>
            <CopyButton value={`${value}`} />
          </Stack>
          <Stack
            gap="xs"
            alignItems="center"
            className={formatAliasWrapperClass}
          >
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
