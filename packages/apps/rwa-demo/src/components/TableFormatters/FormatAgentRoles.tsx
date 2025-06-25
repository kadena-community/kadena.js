import { useAsset } from '@/hooks/asset';
import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import { AGENTROLES } from '@/services/addAgent';
import { MonoCheck } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import React, { useEffect, useMemo } from 'react';

export interface IActionProps {}

export const FormatAgentRoles = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const { asset } = useAsset();
    const allRoles: string[] = useMemo(() => {
      return Object.entries(AGENTROLES).map(([key, value]) => value as string);
    }, [AGENTROLES]);
    const { getAll: getAllAgentRoles, setAssetRolesForAccount } =
      useGetAgentRoles();

    useEffect(() => {
      if (!value || !asset) return;

      setAssetRolesForAccount(`${value}`, asset);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, asset]);

    const renderValue = (value: string) => {
      return getAllAgentRoles().indexOf(value) >= 0 ? <MonoCheck /> : null;
    };

    const roles = allRoles.filter((role) => role !== AGENTROLES.OWNER);

    return (
      <ul>
        {roles.map((value) => {
          return (
            <Stack as="li" key={value}>
              {value} {renderValue(value)}
            </Stack>
          );
        })}
      </ul>
    );
  };
  return Component;
};
