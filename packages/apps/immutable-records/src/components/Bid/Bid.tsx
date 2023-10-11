import type { FC } from 'react';
import { useForm } from 'react-hook-form';

interface BidForm {
  amount: number;
}

export const Bid: FC = () => {
  const form = useForm({
    defaultValues: {
      amount: 0,
    } as BidForm,
  });

  return (
    <form>
      <input type="number" {...form.register('amount')} />
      <button type="submit">Bid</button>
    </form>
  );
};
