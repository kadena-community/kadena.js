import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ICompactStepperItemProps } from '@kadena/kode-ui';
import { useEffect, useState } from 'react';
import { useAsset } from './asset';

type IStepKeys =
  | 'setup'
  | 'compliancerules'
  | 'startcompliance'
  | 'agent'
  | 'investor'
  | 'distribute'
  | 'success';

const steps: ICompactStepperItemProps[] = [
  {
    label: 'Set up your asset',
    id: 'setup',
  },
  {
    label: 'Set up Compliance Rules',
    id: 'compliancerules',
  },
  {
    label: 'Enforce a compliance rule',
    id: 'startcompliance',
  },
  {
    label: 'Add first agent',
    id: 'agent',
  },
  {
    label: 'Add first investor',
    id: 'investor',
  },
  {
    label: 'Distribute first tokens',
    id: 'distribute',
  },
  {
    label: 'Complete',
    id: 'success',
  },
] as const;

export const getStepIdx = (key: IStepKeys): number => {
  return steps.findIndex((step) => step.id === key) ?? 0;
};

export const useAssetSetup = ({ tempAsset }: { tempAsset?: IAsset }) => {
  const [step, setStepProp] = useState<ICompactStepperItemProps>(steps[0]);
  const [stepIdx, setStepIdx] = useState<number>(() =>
    getStepIdx(step?.id as IStepKeys),
  );
  const { setAsset, asset, agents, investors } = useAsset();

  const setStep = (step: IStepKeys) => {
    const newStep = steps.find((s) => s.id === step);
    if (newStep) {
      setStepProp(newStep);
    }
  };

  useEffect(() => {
    if (!tempAsset) return;
    setAsset(tempAsset);
  }, [tempAsset, setAsset]);

  const isOneComplianceRuleSet = (asset: IAsset | undefined): boolean => {
    if (!asset) return false;

    return Object.entries(asset.compliance ?? {}).some(
      ([, rule]) => rule?.value >= 0,
    );
  };

  const isOneComplianceRuleStarted = (asset: IAsset | undefined): boolean => {
    if (!asset) return false;

    return Object.entries(asset.compliance ?? {}).some(
      ([, rule]) => rule?.isActive,
    );
  };

  useEffect(() => {
    setStepIdx(getStepIdx(step.id as IStepKeys));
  }, [step]);

  useEffect(() => {
    if (asset) {
      setStep('compliancerules');
    }

    if (isOneComplianceRuleSet(asset)) {
      setStep('startcompliance');
    }

    if (isOneComplianceRuleStarted(asset)) {
      setStep('agent');
    }
    if (agents.length > 0) {
      setStep('investor');
    }
    if (investors.length > 0) {
      setStep('distribute');
    }
    if (asset?.supply && asset.supply > 0) {
      setStep('success');
    }
  }, [asset, agents, investors]);

  return {
    asset,
    activeStep: step,
    activeStepIdx: stepIdx,
    steps,
    agents,
    investors,
  };
};
