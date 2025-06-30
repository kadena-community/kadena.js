import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useAddInvestor } from '@/hooks/addInvestor';
import { useAssetSetup } from '@/hooks/assetSetup';
import { useDistributeTokens } from '@/hooks/distributeTokens';
import { useEditAgent } from '@/hooks/editAgent';
import { useSetCompliance } from '@/hooks/setCompliance';
import { useUser } from '@/hooks/user';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ICompactStepperItemProps } from '@kadena/kode-ui';
import { Button, CompactStepper, Heading, Stack, Text } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AgentForm } from '../AgentForm/AgentForm';
import { ComplianceRules } from '../ComplianceRules/ComplianceRules';
import { DistributionForm } from '../DistributionForm/DistributionForm';
import { InvestorCombobox } from '../Fields/InvestorCombobox';
import { InvestorForm } from '../InvestorForm/InvestorForm';
import { SetComplianceForm } from '../SetComplianceForm/SetComplianceForm';

interface IProps {
  asset?: IAsset;
}

export const AssetSetupCompletionOverview: FC<IProps> = ({
  asset: tempAsset,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [investerAccount, setInvestorAccount] = useState<string>('');
  const { asset, activeStep, activeStepIdx, steps, investors } = useAssetSetup({
    tempAsset,
  });
  const { findAliasByAddress } = useUser();
  const { isAllowed: isSetComplianceAllowed } = useSetCompliance();
  const { isAllowed: isEditAgentAllowed } = useEditAgent();
  const { isAllowed: isAddInvestorAllowed } = useAddInvestor({});
  const { isAllowed: isDistributeTokensAllowed } = useDistributeTokens({
    investorAccount: investors[0]?.accountName,
  });

  const {
    control,
    formState: { errors },
  } = useForm<ITransferTokensProps>({
    values: {
      amount: 0,
      investorFromAccount: '',
      investorToAccount: '',
    },
  });

  if (!asset) return null;

  const filteredInvestors = investors.map((account) => {
    return {
      accountName: account.accountName,
      alias: findAliasByAddress(account.accountName),
    };
  });

  const handleAccountChange = (cb: any) => async (value: any) => {
    console.log({ value });
    setInvestorAccount(value);

    return cb(value);
  };

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

              <Stack marginBlockStart="md">
                <SetComplianceForm
                  trigger={
                    <Button
                      data-testid="complianceAction"
                      isDisabled={!isSetComplianceAllowed}
                      startVisual={<MonoAdd />}
                    >
                      Set Compliance Rule values
                    </Button>
                  }
                />
              </Stack>
            </Stack>
          ) : null}

          {activeStep.id === 'startcompliance' ? (
            <Stack flexDirection="column" gap="xs">
              <Text>
                Now that we have set up the compliance rules, we need to
                activate them to actually start enforcing compliance.
              </Text>

              <Stack marginBlockStart="md" flexDirection="column" gap="md">
                <ComplianceRules asset={asset} />
              </Stack>
            </Stack>
          ) : null}

          {activeStep.id === 'agent' ? (
            <Stack flexDirection="column" gap="xs">
              <Text>
                Time to add your first agent. Agents are responsible for
                managing the asset and enforcing compliance rules.
              </Text>

              <Stack marginBlockStart="md">
                <AgentForm
                  trigger={
                    <Button
                      isDisabled={!isEditAgentAllowed}
                      startVisual={<MonoAdd />}
                    >
                      Add Agent
                    </Button>
                  }
                />
              </Stack>
            </Stack>
          ) : null}

          {activeStep.id === 'investor' ? (
            <Stack flexDirection="column" gap="xs">
              <Text>
                Next is the first investor. Investors are the ones who will hold
                the asset and trade it on the market.
              </Text>

              <Stack marginBlockStart="md">
                <InvestorForm
                  trigger={
                    <Button
                      isDisabled={!isAddInvestorAllowed}
                      startVisual={<MonoAdd />}
                    >
                      Add Investor
                    </Button>
                  }
                />
              </Stack>
            </Stack>
          ) : null}

          {activeStep.id === 'distribute' ? (
            <Stack flexDirection="column" gap="xs">
              <Text>
                Last step is to distribute the asset to the first investor.
              </Text>

              <Stack marginBlockStart="md">
                <InvestorCombobox
                  investors={filteredInvestors}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  investorToAccount={investerAccount}
                  control={control}
                  error={errors.investorToAccount}
                  handleAccountChange={handleAccountChange}
                />
                <DistributionForm
                  investorAccount={investerAccount}
                  trigger={
                    <Button
                      data-testid="action-distributetokens"
                      startVisual={<MonoAdd />}
                      isDisabled={
                        !investerAccount || !isDistributeTokensAllowed
                      }
                    >
                      Distribute Tokens
                    </Button>
                  }
                />
              </Stack>
            </Stack>
          ) : null}
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
