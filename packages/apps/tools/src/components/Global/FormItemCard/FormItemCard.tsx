import {
  helperButtonIconStyle,
  helperStyle,
  helperTextIconStyle,
} from '@/components/Global/FormItemCard/styles.css';
import { MonoInfo } from '@kadena/kode-icons/system';
import { Card, Grid, GridItem, Heading, Text } from '@kadena/kode-ui';
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
  helperOnClick?: () => void;
}

export const FormItemCard: FC<IFormItemCardProps> = ({
  heading,
  tag,
  info,
  helper,
  helperHref,
  helperOnClick,
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
              <Text>
                {helperHref ? (
                  <button
                    className={helperButtonIconStyle}
                    type="button"
                    onClick={helperOnClick}
                  >
                    <div className={helperTextIconStyle}>
                      <span>{helper}</span>
                      <span>
                        <MonoInfo />
                      </span>
                    </div>
                  </button>
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
