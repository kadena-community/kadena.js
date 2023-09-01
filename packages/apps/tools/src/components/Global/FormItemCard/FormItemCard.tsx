import { Card, Grid, Heading, SystemIcon, Text } from '@kadena/react-ui';

import {
  helperStyle,
  helperTextIconStyle,
} from '@/components/Global/FormItemCard/styles.css';
import Link from 'next/link';
import React, { type ChangeEvent, type FC } from 'react';

export interface IFormItemCardProps {
  heading?: string;
  tag?: string;
  info?: string;
  helper?: string;
  helperHref?: string;
  status?: 'success' | 'error';
  disabled?: boolean;
  children: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const FormItemCard: FC<IFormItemCardProps> = ({
  heading,
  tag,
  info,
  helper,
  helperHref,
  status,
  disabled = false,
  onChange,
  children,
  ...rest
}) => {
  return (
    <div>
      <Card fullWidth disabled={disabled}>
        <Grid.Root columns={2} gap="$3xl">
          <Grid.Item>
            <Heading as="h5">{heading}</Heading>
          </Grid.Item>
          <Grid.Item>
            <div className={helperStyle}>
              <Text size="sm">
                {helperHref ? (
                  <Link className={helperTextIconStyle} href={helperHref}>
                    <span>{helper}</span>
                    <SystemIcon.Information />
                  </Link>
                ) : (
                  <span>{helper}</span>
                )}
              </Text>
            </div>
          </Grid.Item>
        </Grid.Root>
        {children}
      </Card>
    </div>
  );
};
