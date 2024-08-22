import cn from 'classnames';
import React from 'react';
import { Box, Heading, Stack, Text } from '../../components';
import { atoms } from '../../styles';
import {
  bodyContainer,
  bodyContent,
  extendedContainer,
  heading,
} from './CardPattern.css';

export interface ICardContentBlockProps {
  title: string;
  visual?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  supportingContent?: React.ReactNode;
  extendedContent?: React.ReactNode;
  className?: string;
}

export const CardContentBlock = ({
  title,
  visual,
  description,
  children,
  supportingContent,
  extendedContent,
  className,
}: ICardContentBlockProps) => {
  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      gap="xl"
      className={cn(bodyContainer, className)}
    >
      <Stack flexDirection="column" alignItems="flex-start" flex={1}>
        <Box marginBlockEnd="sm">{visual}</Box>
        {title && <Heading className={heading}>{title}</Heading>}
        {description && (
          <Text as="p" className={atoms({ marginBlockEnd: 'md' })}>
            {description}
          </Text>
        )}
        {supportingContent}
      </Stack>
      <Box className={bodyContent} data-layout={!visual && 'no-visual'}>
        {extendedContent && (
          <Box marginBlockEnd="xxl" className={extendedContainer}>
            {extendedContent}
          </Box>
        )}
        {children}
      </Box>
    </Stack>
  );
};
