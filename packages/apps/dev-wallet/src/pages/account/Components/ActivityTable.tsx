import { noStyleLinkClass } from '@/Components/Accounts/style.css';
import { IActivity } from '@/modules/activity/activity.repository';
import { MonoOpenInNew } from '@kadena/kode-icons/system';
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
      activities.map((activity) => ({
        ...activity,
        open: (
          <Link
            to={`/transfer?activityId=${activity.uuid}`}
            className={noStyleLinkClass}
          >
            <MonoOpenInNew />
          </Link>
        ),
        amount: activity.data.transferData.receivers.reduce(
          (acc, { amount }) => {
            return acc + parseFloat(amount);
          },
          0,
        ),
        receivers: activity.data.transferData.receivers
          .map((receiver) => receiver.address)
          .join(', '),
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
          label: '',
          key: 'open',
          width: '10%',
          render: ({ value }) => value,
        },
        {
          label: 'Type',
          key: 'type',
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
          width: '70%',
        },
      ]}
      data={data}
    />
  );
}
