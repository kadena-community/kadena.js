import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import { AGENTROLES } from '@/services/addAgent';
import { MonoCheck } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import React, { useMemo } from 'react';

export interface IActionProps {}

export const FormatAgentRoles = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const allRoles: string[] = useMemo(() => {
      return Object.entries(AGENTROLES).map(([key, value]) => value as string);
    }, [AGENTROLES]);
    const { getAll: getAllAgentRoles } = useGetAgentRoles();

    const renderValue = (value: string) => {
      return getAllAgentRoles().indexOf(value) >= 0 ? <MonoCheck /> : null;
    };

    return (
      <ul>
        {allRoles.map((value) => {
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
