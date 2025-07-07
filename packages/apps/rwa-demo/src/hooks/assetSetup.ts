import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ICompactStepperItemProps } from '@kadena/kode-ui';
import { useCallback, useEffect, useState } from 'react';
import { useAsset } from './asset';

export type IStepKeys =
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
  const idx = steps.findIndex((step) => step.id === key);
  return idx < 0 ? 0 : idx;
};

export const useAssetSetup = ({ tempAsset }: { tempAsset?: IAsset }) => {
  const [step, setStepProp] = useState<ICompactStepperItemProps>(steps[0]);
  const [percentageComplete, setPercentageComplete] = useState<number>(0);
  const [stepIdx, setStepIdx] = useState<number>(() =>
    getStepIdx(step?.id as IStepKeys),
  );
  const {
    setAsset,
    asset,
    agents,
    investors,
    agentsIsLoading,
    investorsIsLoading,
    assetStore,
  } = useAsset();

  const setStep = (step: IStepKeys) => {
    const newStep = steps.find((s) => s.id === step);
    if (newStep) {
      setStepProp(newStep);
    }
  };

  useEffect(() => {
    if (!tempAsset) return;
    setAsset(tempAsset);
  }, [tempAsset?.uuid, setAsset]);

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
  }, [step.id]);

  useEffect(() => {
    const percentageStep = 100 / (steps.length - 1);
    setPercentageComplete((v) => 0);
    let stepName: IStepKeys = 'setup';
    let percentage = 0;
    if (asset) {
      stepName = 'compliancerules';
      percentage += percentageStep;
    }

    if (agentsIsLoading || investorsIsLoading) return;

    if (isOneComplianceRuleSet(asset)) {
      stepName = 'startcompliance';
      percentage += percentageStep;
    }

    if (isOneComplianceRuleStarted(asset)) {
      stepName = 'agent';
      percentage += percentageStep;
    }
    if (agents.length > 0) {
      stepName = 'investor';
      percentage += percentageStep;
    }
    if (investors.length > 0) {
      stepName = 'distribute';
      percentage += percentageStep;
    }
    if (asset?.supply && asset.supply > 0) {
      stepName = 'success';
      percentage = 100;
    }

    setStep(stepName);

    setPercentageComplete((v) => {
      if (percentage > 100) return 100;
      return Math.round(percentage);
    });
  }, [
    asset?.uuid,
    asset?.supply,
    asset?.compliance,
    agents.length,
    investors.length,
    agentsIsLoading,
    investorsIsLoading,
  ]);

  const completeAssetSetup = useCallback(async () => {
    if (!asset) return;
    const newAsset: IAsset = { ...asset, setupComplete: true };
    await assetStore?.updateAsset(newAsset);
  }, [asset]);

  return {
    asset,
    activeStep: step,
    activeStepIdx: stepIdx,
    steps,
    setActiveStep: setStep,
    percentageComplete,
    isLoading: agentsIsLoading || investorsIsLoading,
    isOneComplianceRuleSet: isOneComplianceRuleSet(asset),
    isOneComplianceRuleStarted: isOneComplianceRuleStarted(asset),
    completeAssetSetup,
  };
};
