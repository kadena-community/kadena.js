import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAccount } from '@/hooks/account';
import { useAddInvestor } from '@/hooks/addInvestor';
import { useAsset } from '@/hooks/asset';
import { useAssetSetup } from '@/hooks/assetSetup';
import { useDistributeTokens } from '@/hooks/distributeTokens';
import { useEditAgent } from '@/hooks/editAgent';
import { useSetCompliance } from '@/hooks/setCompliance';
import { useUser } from '@/hooks/user';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ICompactStepperItemProps } from '@kadena/kode-ui';
import {
  Button,
  Heading,
  maskValue,
  Notification,
  Stack,
  Step,
  Stepper,
  Text,
} from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarHeaderContext,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AgentForm } from '../AgentForm/AgentForm';
import { ComplianceRules } from '../ComplianceRules/ComplianceRules';
import { DistributionForm } from '../DistributionForm/DistributionForm';
import { InvestorCombobox } from '../Fields/InvestorCombobox';
import { InvestorForm } from '../InvestorForm/InvestorForm';
import { SetComplianceForm } from '../SetComplianceForm/SetComplianceForm';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { AssetSetupProgress } from './AssetSetupProgress';

interface IProps {
  asset?: IAsset;
}

export const AssetSetupCompletionOverview: FC<IProps> = ({
  asset: tempAsset,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [investerAccount, setInvestorAccount] = useState<string>('');
  const {
    asset,
    activeStep,
    activeStepIdx,
    steps,
    isOneComplianceRuleSet,
    isOneComplianceRuleStarted,
    completeAssetSetup,
    percentageComplete,
    isLoading,
  } = useAssetSetup({
    tempAsset,
  });
  const [innerStep, setInnerStep] = useState<ICompactStepperItemProps>(
    steps[0],
  );
  const { agentsIsLoading, agents, investorsIsLoading, investors } = useAsset();
  const { findAliasByAddress } = useUser();
  const { accountRoles, account } = useAccount();
  const { isAllowed: isSetComplianceAllowed } = useSetCompliance();
  const { isAllowed: isEditAgentAllowed, submit: submitEditAgent } =
    useEditAgent();
  const { isAllowed: isAddInvestorAllowed, submit: submitAddInvestor } =
    useAddInvestor({});
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

  useEffect(() => {
    setInnerStep(activeStep);
  }, [activeStep.id]);

  const accountIsAlreadyAgent = agents.some(
    (a) => a.accountName === account?.address,
  );
  const canAddOwnAccountAsAgent = isEditAgentAllowed && !accountIsAlreadyAgent;

  const handleAddOwnAccountAsAgent = useCallback(async () => {
    if (!account?.address || !canAddOwnAccountAsAgent) return;
    await submitEditAgent({
      accountName: account.address,
      agent: account,
      roles: ['agent-admin', 'freezer', 'transfer-manager'],
    });
  }, [account?.address, canAddOwnAccountAsAgent]);

  const accountIsAlreadyInvestor = investors.some(
    (a) => a.accountName === account?.address,
  );
  const canAddOwnAccountAsInvestor =
    isAddInvestorAllowed && !accountIsAlreadyInvestor;

  const handleAddOwnAccountAsInvestor = useCallback(async () => {
    if (!account?.address || !canAddOwnAccountAsInvestor) return;
    await submitAddInvestor({
      accountName: account.address,
    });
  }, [account?.address, canAddOwnAccountAsInvestor]);

  if (!asset) return null;

  const filteredInvestors = investors.map((account) => {
    return {
      accountName: account.accountName,
      alias: findAliasByAddress(account.accountName),
    };
  });

  const handleAccountChange = (cb: any) => async (value: any) => {
    setInvestorAccount(value);
    return cb(value);
  };

  return (
    <>
      <SideBarHeaderContext>
        <AssetSetupProgress
          asset={asset}
          percentageComplete={percentageComplete}
          isLoading={isLoading}
          completeAssetSetup={completeAssetSetup}
        />
      </SideBarHeaderContext>
      <SectionCard stack="horizontal">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Get Started"
            actions={
              <>
                <Stepper direction="vertical" showSuccess>
                  {steps.map((step, idx) => (
                    <Step
                      key={step.id}
                      active={activeStep.id === step.id}
                      onClick={
                        idx <= activeStepIdx
                          ? () => setInnerStep(step)
                          : undefined
                      }
                    >
                      {step.label}
                    </Step>
                  ))}
                </Stepper>
              </>
            }
          />
          <SectionCardBody>
            <Heading as="h3">{innerStep.label}</Heading>
            {innerStep.id === 'setup' ? (
              <Stack flexDirection="column" gap="xs">
                <Text>The setup of the asset is already done.</Text>
              </Stack>
            ) : null}
            {innerStep.id === 'compliancerules' ? (
              <Stack flexDirection="column" gap="xs">
                {isOneComplianceRuleSet ? (
                  <>
                    <Text>
                      The values for the compliance rules have been set.
                    </Text>

                    {Object.entries(asset.compliance ?? {}).map(
                      ([key, rule]) => (
                        <Stack key={key} gap="xs">
                          <Text>{key}:</Text>
                          <Text variant="code">
                            {rule.value < 0 ? 'infinite' : rule.value}
                          </Text>
                        </Stack>
                      ),
                    )}
                  </>
                ) : (
                  <>
                    <Text>
                      You have set up your asset. The first step now is to set
                      up some compliance rules.
                    </Text>
                    <Text>
                      These rules will be used to ensure that the asset is
                      compliant with your regulations.
                    </Text>
                  </>
                )}

                <Stack marginBlockStart="md">
                  <SetComplianceForm
                    trigger={
                      <Button
                        aria-label="Set compliance rule values"
                        data-testid="complianceAction"
                        isDisabled={!isSetComplianceAllowed}
                        startVisual={
                          <TransactionTypeSpinner
                            type={[TXTYPES.SETCOMPLIANCE]}
                            fallbackIcon={<MonoAdd />}
                          />
                        }
                      >
                        Set Compliance Rule values
                      </Button>
                    }
                  />
                </Stack>
              </Stack>
            ) : null}
            {innerStep.id === 'startcompliance' ? (
              <Stack flexDirection="column" gap="xs">
                {isOneComplianceRuleStarted ? (
                  <Text>
                    At least 1 compliance rule has been activated.
                    <br />
                    You can change them below.
                  </Text>
                ) : (
                  <Text>
                    Now that we have set up the compliance rules, we need to
                    activate them to actually start enforcing compliance.
                  </Text>
                )}

                <Stack marginBlockStart="md" flexDirection="column" gap="md">
                  <ComplianceRules asset={asset} />
                </Stack>
              </Stack>
            ) : null}
            {innerStep.id === 'agent' ? (
              <Stack flexDirection="column" gap="xs">
                {agentsIsLoading ? (
                  <TransactionPendingIcon />
                ) : (
                  <>
                    {agents.length === 0 ? (
                      <Text>
                        Time to add your first agent. Agents are responsible for
                        managing the asset and enforcing compliance rules.
                      </Text>
                    ) : (
                      <>
                        <Text>
                          There are <Text variant="code">{agents.length}</Text>{' '}
                          agents for this asset.
                        </Text>
                        <Text>
                          You can find the list <Link href="/agents">here</Link>
                        </Text>
                      </>
                    )}

                    <Stack
                      marginBlockStart="md"
                      flexDirection={{
                        xs: 'column',
                        sm: 'row',
                        md: 'column',
                        lg: 'row',
                      }}
                      gap="md"
                    >
                      {accountIsAlreadyAgent ? (
                        <Text>
                          Your account{' '}
                          <Text variant="code">
                            {maskValue(account?.address ?? '')}{' '}
                          </Text>
                          already an agent for this asset.
                        </Text>
                      ) : (
                        <Button
                          variant="transparent"
                          isDisabled={!canAddOwnAccountAsAgent}
                          onPress={handleAddOwnAccountAsAgent}
                          startVisual={
                            <TransactionTypeSpinner
                              type={[TXTYPES.ADDAGENT]}
                              fallbackIcon={<MonoAdd />}
                            />
                          }
                        >
                          Add myself as an agent
                        </Button>
                      )}
                      <AgentForm
                        trigger={
                          <Button
                            aria-label="Add new agent"
                            isDisabled={!isEditAgentAllowed}
                            startVisual={
                              <TransactionTypeSpinner
                                type={[TXTYPES.ADDAGENT]}
                                fallbackIcon={<MonoAdd />}
                              />
                            }
                          >
                            Add new Agent
                          </Button>
                        }
                      />
                    </Stack>
                  </>
                )}
              </Stack>
            ) : null}
            {innerStep.id === 'investor' ? (
              <Stack flexDirection="column" gap="xs">
                {investorsIsLoading ? (
                  <TransactionPendingIcon />
                ) : (
                  <>
                    {investors.length === 0 ? (
                      <Text>
                        Next is the first investor. Investors are the ones who
                        will hold the asset and trade it on the market.
                      </Text>
                    ) : (
                      <>
                        <Text>
                          There are{' '}
                          <Text variant="code">{investors.length}</Text>{' '}
                          investors for this asset.
                        </Text>
                        <Text>
                          You can find the list{' '}
                          <Link href="/investors">here</Link>
                        </Text>
                      </>
                    )}

                    <Stack
                      marginBlockStart="md"
                      flexDirection={{
                        xs: 'column',
                        sm: 'row',
                        md: 'column',
                        lg: 'row',
                      }}
                      gap="md"
                    >
                      {accountIsAlreadyInvestor ? (
                        <Text>
                          Your account{' '}
                          <Text variant="code">
                            {maskValue(account?.address ?? '')}{' '}
                          </Text>
                          already an investor for this asset.
                        </Text>
                      ) : (
                        <Button
                          variant="transparent"
                          isDisabled={!canAddOwnAccountAsInvestor}
                          onPress={handleAddOwnAccountAsInvestor}
                          startVisual={
                            <TransactionTypeSpinner
                              type={[TXTYPES.ADDINVESTOR]}
                              fallbackIcon={<MonoAdd />}
                            />
                          }
                        >
                          Add myself as an investor
                        </Button>
                      )}
                      <InvestorForm
                        trigger={
                          <Button
                            aria-label="Add new investor"
                            isDisabled={!isAddInvestorAllowed}
                            startVisual={
                              <TransactionTypeSpinner
                                type={[TXTYPES.ADDINVESTOR]}
                                fallbackIcon={<MonoAdd />}
                              />
                            }
                          >
                            Add new Investor
                          </Button>
                        }
                      />
                    </Stack>
                  </>
                )}
              </Stack>
            ) : null}
            {innerStep.id === 'distribute' ? (
              <Stack flexDirection="column" gap="xs">
                {asset.supply === 0 ? (
                  <Text>
                    Last step is to distribute the asset to the first investor.
                  </Text>
                ) : (
                  <Text>
                    There are already {asset.supply} tokens distributed for this
                    asset, among your investors.
                  </Text>
                )}

                {!accountRoles.isTransferManager() && (
                  <Notification
                    role="status"
                    intent="warning"
                    type="inlineStacked"
                  >
                    Only an agent with the transfer manager role can distribute
                    tokens. (The current user does not have that role)
                    <br />
                    It could be useful to add the owner of this asset as an
                    agent with these roles.
                  </Notification>
                )}
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
                        aria-label="Distribute tokens"
                        data-testid="action-distributetokens"
                        startVisual={
                          <TransactionTypeSpinner
                            type={[TXTYPES.DISTRIBUTETOKENS]}
                            fallbackIcon={<MonoAdd />}
                          />
                        }
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
            {innerStep.id === 'success' ? (
              <Stack flexDirection="column" gap="xs">
                <Text>
                  Nicely done!
                  <br />
                  The initial setup is done and you are ready to go.
                </Text>
              </Stack>
            ) : null}
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
