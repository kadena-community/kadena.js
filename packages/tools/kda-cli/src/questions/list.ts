import { IAnswers, IQuestion } from './questions.js';

const listCondition = ({ task }: IAnswers): boolean => {
  if (Array.isArray(task)) return task?.includes('list');
  return false;
};

export const listQuestions: IQuestion[] = [
  {
    message: 'On which network would you like to search?',
    name: 'network',
    type: 'input',
    defaultValue: 'fast-development',
    when: listCondition,
  },
  {
    message: 'On what chain would you like to search?',
    name: 'chainId',
    type: 'input',
    choices: [...Array(20).keys()].map((i) => ({
      label: i.toString(),
      value: i.toString(),
    })),
    when: listCondition,
  },
  {
    message: 'How much height do you want to go back? (default: 1000)',
    name: 'height',
    type: 'input',
    defaultValue: '1000',
    when: listCondition,
  },
  {
    message: 'What endpoint would you like to use?',
    name: 'endpoint',
    type: 'input',
    defaultValue: 'http://devnet:1848',
    when: listCondition,
  },
  {
    message: 'Searching transactions',
    name: 'transactions',
    type: 'execute',
    when: listCondition,
    action: async ({
      network,
      chainId,
      endpoint,
      height: minheight,
    }: IAnswers) => {
      const res = await fetch(`${endpoint}/chainweb/0.0/${network}/cut`);
      const cuts = await res.json();
      const { height } = cuts.hashes[chainId.toString()];
      const heightRes = await fetch(
        `${endpoint}/chainweb/0.0/${network}/chain/${chainId}/header?minheight=${
          height - Number(minheight)
        }&limit=1000`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json;blockheader-encoding=object',
          },
        },
      );
      const payloadHashes = await heightRes.json();
      const transactions = await Promise.all(
        payloadHashes.items.flatMap(async ({ payloadHash }: any) => {
          const payloadRes = await fetch(
            `${endpoint}/chainweb/0.0/${network}/chain/${chainId}/payload/${payloadHash}/outputs`,
          );
          const payload = await payloadRes.json();
          return payload.transactions.flatMap((t: any) =>
            t.flatMap((x: any) => JSON.parse(atob(x))),
          );
        }),
      );
      return { transactions: transactions.flatMap((t: any) => t) };
    },
  },
];
