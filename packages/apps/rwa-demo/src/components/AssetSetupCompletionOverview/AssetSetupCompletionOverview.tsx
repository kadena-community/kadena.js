import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useAssetSetup } from '@/hooks/assetSetup';
import type { ICompactStepperItemProps } from '@kadena/kode-ui';
import { CompactStepper, Heading, Stack, Text } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

interface IProps {
  asset?: IAsset;
}

export const AssetSetupCompletionOverview: FC<IProps> = ({
  asset: tempAsset,
}) => {
  const { asset, activeStep, activeStepIdx, steps } = useAssetSetup({
    tempAsset,
  });

  if (!asset) return null;

  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader
          title="Get Started"
          actions={
            <>
              {activeStep.id !== 'success' ? (
                <CompactStepper
                  stepIdx={activeStepIdx}
                  steps={steps as ICompactStepperItemProps[]}
                />
              ) : null}
            </>
          }
        />
        <SectionCardBody>
          <Heading as="h3">{activeStep.label}</Heading>
          {activeStep.id === 'compliancerules' ? (
            <Stack flexDirection="column" gap="xs">
              <Text>
                You have set up your asset. The first step now is to set up some
                compliance rules.
              </Text>
              <Text>
                These rules will be used to ensure that the asset is compliant
                with your regulations.
              </Text>
            </Stack>
          ) : null}
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
