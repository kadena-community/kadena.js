import { useTransfers } from '../hooks/transfers';

export const Transfers = () => {
  const { transfers, pendingTransfers } = useTransfers();

  return (
    <div>
      <h3 className="text-2xl">Transfers</h3>
      <div>
        {pendingTransfers?.map((transfer, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-x-2 my-4 border-b pb-4"
          >
            <div className="font-semibold">Request key</div>
            <div>{transfer.requestKey}</div>
            <div className="font-semibold">Chain</div>
            <div>{transfer.chainId}</div>
            <div className="font-semibold">Sender</div>
            <div>{transfer.senderAccount}</div>
            <div className="font-semibold">Receiver</div>
            <div>{transfer.receiverAccount}</div>
            <div className="font-semibold">Amount</div>
            <div>{transfer.amount}</div>
            <div>Status</div>
            <div>Pending</div>
          </div>
        ))}
      </div>
      <div>
        {transfers?.map((transfer, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-x-2 my-4 border-b pb-4"
          >
            <div className="font-semibold">Request key</div>
            <div>{transfer.requestKey}</div>
            <div className="font-semibold">Chain</div>
            <div>{transfer.chainId}</div>
            <div className="font-semibold">Sender</div>
            <div>{transfer.senderAccount}</div>
            <div className="font-semibold">Receiver</div>
            <div>{transfer.receiverAccount}</div>
            <div className="font-semibold">Amount</div>
            <div>{transfer.amount}</div>
            <div>Status</div>
            <div>Success</div>
          </div>
        ))}
      </div>
    </div>
  );
};
