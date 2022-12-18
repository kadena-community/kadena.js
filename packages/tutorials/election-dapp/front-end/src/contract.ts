
import { Pact, signWithChainweaver } from '@kadena/client'
import { pollTransactions } from './utils'

const NETWORK_ID = 'testnet04'
const CHAIN_ID = '0'
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`

const accountKey = (account: string): string => account.split(':')[1]

/**
 * Call the user-voted function on the election contract to check if the user has voted before
 *
 * @param account - The user's account
 * @return boolean indiciation the vote status
 */
export const hasUserVoted = async (account: string): Promise<boolean> => {
  const transactionBuilder = Pact.modules['free.election']['user-voted'](account)
  const { result } = await transactionBuilder.local(API_HOST)

  if (result.status === 'success') {
    return result.data.valueOf() as boolean
  } else {
    console.log(result.error)
    return false
  }
}

/**
 * Return the amount of votes a candidate has received
 *
 * @param candidateId - The candidate's id
 * @return the number of votes
 */
export const getVotes = async (candidateId: string): Promise<number> => {
  const transactionBuilder = Pact.modules['free.election']['get-votes'](candidateId)
  const { result } = await transactionBuilder.local(API_HOST)

  if (result.status === 'success') {
    return result.data.valueOf() as number
  } else {
    console.log(result.error)
    return 0
  }
}

/**
 * Vote for a candidate and poll the transaction status afterwards
 *
 * @param account - The account that is voting
 * @param candidateId - The candidateId that is being voted for
 * @return
 */
export const vote = async (account: string, candidateId: string): Promise<void> => {
  const transactionBuilder = Pact.modules['free.election']
    .vote(account, candidateId)
    // @ts-ignore
    .addCap('coin.GAS', accountKey(account))
    // @ts-ignore
    .addCap('free.election.ACCOUNT-OWNER', accountKey(account), account)
    .setMeta({
      ttl: 28000,
      gasLimit: 100000,
      chainId: CHAIN_ID,
      gasPrice: 0.000001,
      sender: account,
    }, NETWORK_ID)

    const signedTransaction = await signWithChainweaver(transactionBuilder)

    console.log(`Sending transaction: ${signedTransaction[0].code}`)
    const response = await signedTransaction[0].send(API_HOST)

    console.log('Send response: ', response)
    const requestKey = response.requestKeys[0]
    await pollTransactions([requestKey], API_HOST)
}