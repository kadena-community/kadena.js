import { collectResponses, getQuestionKeys, processProject, } from '../utils/helpers.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { FundQuestions, fundQuestions } from './fundQuestions.js';
import { makeFundRequest } from './makeFundRequest.js';
import { Option } from 'commander';
import { ZodError } from 'zod';
export function fundCommand(program, version) {
    program
        .command('fund')
        .description('fund an account on a devnet or testnet')
        .option('-r, --receiver <receiver>', 'Receiver (k:) wallet address')
        .addOption(new Option('-c, --chainId <number>', 'Chain to retrieve from (default 1)').argParser((value) => parseInt(value, 10)))
        .addOption(new Option('-n, --network <network>', 'Network to retrieve from'))
        .option('-nid, --networkId <networkId>', 'Kadena network Id (e.g. "testnet04")')
        .option('-p, --project <project>', 'project file to use')
        .action(async (args) => {
        try {
            let projectArgs = {};
            if (args.project !== undefined) {
                projectArgs = await processProject(args.project, getQuestionKeys(fundQuestions));
            }
            const responses = await collectResponses({ ...projectArgs, ...args }, fundQuestions);
            const requestArgs = {
                ...args,
                ...responses,
            };
            FundQuestions.parse(requestArgs);
            await makeFundRequest(requestArgs);
        }
        catch (e) {
            if (e instanceof ZodError) {
                processZodErrors(program, e, args);
                return;
            }
            throw e;
        }
    });
}
