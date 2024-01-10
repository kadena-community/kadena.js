import {
  helperStyle,
  helperTextIconStyle,
} from '@/components/Global/FormItemCard/styles.css';
import {
  Card,
  Grid,
  GridItem,
  Heading,
  SystemIcon,
  Text,
} from '@kadena/react-ui';
import Link from 'next/link';
import type { ChangeEvent, FC } from 'react';
import React from 'react';

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
        <Grid columns={2} gap="xxxl">
          <GridItem>
            <Heading as="h5">{heading}</Heading>
          </GridItem>
          <GridItem>
            <div className={helperStyle}>
              <Text variant="smallest">
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
          </GridItem>
        </Grid>
        {children}
      </Card>
    </div>
  );
};
