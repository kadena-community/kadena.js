import { useAccount } from '@/hooks/account';
import { isFrozen as isFrozenService } from '@/services/isFrozen';
import { Badge } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import { CompactTableFormatters } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';

export const FormatCheckboxForFrozen = (props: { name: string }) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const { account } = useAccount();
    const [isFrozen, setIsFrozen] = useState(false);
    const init = async () => {
      if (!account) return;
      const res = await isFrozenService({
        investorAccount: value as string,
        account,
      });

      setIsFrozen(res as boolean);
    };

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      init();
    }, [account]);

    if (isFrozen) {
      return <Badge size="sm">Frozen</Badge>;
    }

    if (value === account?.address) {
      return <Badge size="sm">sender</Badge>;
    }

    return CompactTableFormatters.FormatCheckbox(props)({ value });
  };

  return Component;
};
