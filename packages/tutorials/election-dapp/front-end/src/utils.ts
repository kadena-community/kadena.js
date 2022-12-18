import { poll } from '@kadena/chainweb-node-client';

const delay = (millis: number) => new Promise<void>(resolve => {
  setTimeout(() => resolve(), millis)
})

/**
 * Poll for transaction mined on the blockchain
 *
 * @param requestKeys - Array of request keys to poll
 * @param apiHost - API host
 * @return
 */
export async function pollTransactions(
  requestKeys: string[],
  apiHost: string,
): Promise<void> {
  if (requestKeys.length === 0) {
    console.log('function called without arguments')
    return
  }

  console.log(`Polling for: ${requestKeys.join(',')}`)
  const pollResponse = await poll({ requestKeys }, apiHost)

  if (Object.keys(pollResponse).length === 0) {
    console.log('No transactions found yet')
    await delay(5000)
    return pollTransactions(requestKeys, apiHost)
  } else {
    console.log('Found transactions:')
    const foundRequestKeys: string[] = [];
    Object.keys(pollResponse).forEach((requestKey) => {
      console.log(
        `Request key: ${requestKey}\nPoll response:\n`,
        JSON.stringify(pollResponse[requestKey], undefined, 2),
      )
      foundRequestKeys.push(requestKey)
    })

    const remainingTransactions = requestKeys.filter(
      (k) => !foundRequestKeys.includes(k),
    )

    if (remainingTransactions.length) {
      await delay(5000)
      return pollTransactions(requestKeys, apiHost)
    } else {
      console.log('Polling Completed')
    }
  }
}