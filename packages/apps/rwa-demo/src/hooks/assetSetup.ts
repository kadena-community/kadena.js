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
    label: 'Start a compliance rule',
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
] as const;

export const getStepIdx = (key: IStepKeys): number => {
  return steps.findIndex((step) => step.id === key) ?? 0;
};

export const useAssetSetup = ({ tempAsset }: { tempAsset?: IAsset }) => {
  const [step, setStep] = useState<IStepKeys>('setup');
  const [stepIdx, setStepIdx] = useState<number>(() => getStepIdx(step));
  const {
    setAsset,
    asset,
    agents,
    investors,
    initFetchAgents,
    initFetchInvestors,
  } = useAsset();

  useEffect(() => {
    if (!tempAsset) return;
    setAsset(tempAsset);
  }, [tempAsset?.uuid]);

  const isOneComplianceRuleSet = (asset: IAsset | undefined): boolean => {
    if (!asset) return false;

    return Object.entries(asset.compliance ?? {}).some(
      ([key, rule]: any) => rule?.value >= 0,
    );
  };

  const isOneComplianceRuleStarted = (asset: IAsset | undefined): boolean => {
    if (!asset) return false;

    return Object.entries(asset.compliance ?? {}).some(
      ([key, rule]: any) => rule?.isActive,
    );
  };

  useEffect(() => {
    if (!asset) return;
    initFetchAgents();
    initFetchInvestors();
  }, [asset]);

  useEffect(() => {
    setStepIdx(getStepIdx(step));
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
