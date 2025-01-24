import { noStyleLinkClass } from '@/Components/Accounts/style.css';
import { IActivity } from '@/modules/activity/activity.repository';
import { shorten } from '@/utils/helpers';
import { Text } from '@kadena/kode-ui';
import { CompactTable, usePagination } from '@kadena/kode-ui/patterns';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export function ActivityTable({ activities }: { activities: IActivity[] }) {
  const { variables, handlePageChange, pageSize } = usePagination({
    id: 'ActivityTable',
  });
  console.log('variables', variables);
  const data = useMemo(
    () =>
      !activities
        ? []
        : activities
            .filter((activity) => activity?.data?.transferData?.senderAccount)
            .map((activity) => ({
              ...activity,
              open: (
                <Link
                  to={`/transfer?activityId=${activity.uuid}`}
                  className={noStyleLinkClass}
                  style={{ textDecoration: 'underline' }}
                >
                  <Text variant="code">{shorten(activity.uuid)}</Text>
                </Link>
              ),
              sender: shorten(
                activity.data.transferData.senderAccount?.address ?? '',
                6,
              ),
              amount: activity.data.transferData.receivers.reduce(
                (acc, { amount }) => {
                  return acc + parseFloat(amount);
                },
                0,
              ),
              receivers: activity.data.transferData.receivers
                .map((receiver) => shorten(receiver?.address ?? '', 6))
                .join(' | '),
            })),
    [activities],
  );

  console.log('data', data);
  return (
    <CompactTable
      setPage={handlePageChange}
      pageSize={pageSize}
      totalCount={activities.length}
      fields={[
        {
          label: 'Id',
          key: 'open',
          width: '10%',
          variant: 'code',
          render: ({ value }) => value,
        },
        {
          label: 'Type',
          key: 'type',
          variant: 'code',
          width: '10%',
        },
        {
          label: 'Sender',
          key: 'sender',
          variant: 'code',
          width: '10%',
        },
        {
          label: 'Amount',
          key: 'amount',
          variant: 'code',
          width: '10%',
          align: 'end',
        },
        {
          label: 'Receivers',
          key: 'receivers',
          variant: 'code',
          width: '70%',
        },
      ]}
      data={data}
    />
  );
}
