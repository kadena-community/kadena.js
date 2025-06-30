import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useAssetSetup } from '@/hooks/assetSetup';
import type { ICompactStepperItemProps } from '@kadena/kode-ui';
import { CompactStepper } from '@kadena/kode-ui';
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
              {activeStep !== 'success' ? (
                <CompactStepper
                  stepIdx={activeStepIdx}
                  steps={steps as ICompactStepperItemProps[]}
                />
              ) : null}
            </>
          }
        />
        <SectionCardBody>
          <pre>{JSON.stringify(asset, null, 2)}</pre>
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
