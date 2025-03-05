import type { FC, ReactElement } from 'react';
import React from 'react';
import { FocussedLayout } from '../FocussedLayout';
import type { ISectionCardProps } from '../SectionCard';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '../SectionCard';
import { Footer } from './components/Footer/Footer';

interface ILandingPageLayout extends ISectionCardProps {
  title: string;
  description: ReactElement;
}

export const LandingPageLayout: FC<ILandingPageLayout> = ({
  children,
  stack = 'horizontal',
  variant = 'base',
  icon,
  intent,
  isLoading = false,
  background = 'none',
  ['data-testid']: dataTestId,
  title,
  description,
}) => {
  return (
    <FocussedLayout>
      <SectionCard
        background={background}
        stack={stack}
        intent={intent}
        isLoading={isLoading}
        data-testid={dataTestId}
        icon={icon}
        variant={variant}
      >
        <SectionCardContentBlock>
          <SectionCardBody>{children}</SectionCardBody>
          <SectionCardHeader title={title} description={description} />
        </SectionCardContentBlock>
      </SectionCard>
      <Footer />
    </FocussedLayout>
  );
};
