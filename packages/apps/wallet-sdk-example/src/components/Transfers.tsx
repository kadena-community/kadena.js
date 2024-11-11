import clsx from 'clsx';
import { useTransfers } from '../hooks/transfers';
import { TextEllipsis } from './Text';

export const Transfers = () => {
  const { transfers, pendingTransfers, account } = useTransfers();

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">
        Transfers
      </h3>

      {/* Pending Transfers Table */}
      <div className="mb-8">
        <h4 className="text-xl font-medium text-primary-green mb-4">
          Pending Transfers
        </h4>
        {pendingTransfers?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-medium-slate rounded-lg">
              <thead>
                <tr className="bg-dark-slate text-white">
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Request Key
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Chain
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Sender
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Receiver
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Amount
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingTransfers.map((transfer, index) => (
                  <tr
                    key={index}
                    className="border-b border-border-gray last:border-none"
                  >
                    <td className="py-2 px-4 text-white break-all">
                      {transfer.requestKey}
                    </td>
                    <td className="py-2 px-4 text-white">{transfer.chainId}</td>
                    <td className="py-2 px-4 text-white">
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.senderAccount}
                      </TextEllipsis>
                    </td>
                    <td className="py-2 px-4 text-white">
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.receiverAccount}
                      </TextEllipsis>
                    </td>
                    <td className="py-2 px-4 text-white">{transfer.amount}</td>
                    <td className="py-2 px-4 text-primary-green">Pending</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-secondary">No pending transfers</p>
        )}
      </div>

      {/* Completed Transfers Table */}
      <div>
        <h4 className="text-xl font-medium text-primary-green mb-4">
          Completed Transfers
        </h4>
        {transfers?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-medium-slate rounded-lg">
              <thead>
                <tr className="bg-dark-slate text-white">
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Request Key
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Chain
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Sender
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Receiver
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Amount
                  </th>
                  <th className="py-2 px-4 text-left font-semibold whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, index) => (
                  <tr
                    key={index}
                    className="border-b border-border-gray last:border-none"
                  >
                    <td className="py-2 px-4 text-white break-all">
                      {transfer.requestKey}
                    </td>
                    <td className="py-2 px-4 text-white">{transfer.chainId}</td>
                    <td className="py-2 px-4 text-white">
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.senderAccount}
                      </TextEllipsis>
                    </td>
                    <td className="py-2 px-4 text-white">
                      <TextEllipsis maxLength={15} withCopyButton>
                        {transfer.receiverAccount}
                      </TextEllipsis>
                    </td>
                    <td className="py-2 px-4 text-white">
                      <span
                        className={clsx({
                          'text-gray-400': transfer.success == false,
                          'text-red-400':
                            transfer.senderAccount === account &&
                            transfer.success === true,
                          'text-green-400':
                            transfer.senderAccount !== account &&
                            transfer.success === true,
                        })}
                      >
                        {transfer.senderAccount === account
                          ? `-${transfer.amount}`
                          : `+${transfer.amount}`}
                      </span>
                      <br />
                      <span className="text-red-400">
                        {`-${transfer.transactionFeeTransfer?.amount}`}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-secondary-green">
                      {transfer.success ? 'Success' : 'Failed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-secondary">No completed transfers</p>
        )}
      </div>
    </div>
  );
};
