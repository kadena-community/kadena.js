import { createPactCommandFromTemplate } from '.';
import { submitClient } from '../core';
import { IClientConfig } from '../core/utils/helpers';

export interface ITemplateInput {
  deployArguments?: Record<string, any>;
  workingDirectory?: string;
  templatePath: string;
}

export const deployTemplate = async (
  inputs: ITemplateInput,
  config: IClientConfig,
) =>
  submitClient(config)(
    await createPactCommandFromTemplate(
      inputs.templatePath,
      inputs.deployArguments || {},
      inputs.workingDirectory,
    ),
  );
