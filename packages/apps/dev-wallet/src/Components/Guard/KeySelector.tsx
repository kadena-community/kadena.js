import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { Checkbox, Stack, Text } from '@kadena/kode-ui';
import { useEffect, useState } from 'react';
import { backgroundClass, labelClass } from './style.css';

export const KeySelector = ({
  guard,
  onSelect,
  selectedKeys,
}: {
  guard: { keys: string[]; pred: BuiltInPredicate };
  onSelect: (keys: string[]) => void;
  selectedKeys: string[];
}) => {
  const { getKeyAlias } = useWallet();
  const keysWithAlias = guard.keys.map((key) => ({
    key,
    alias: getKeyAlias(key),
  }));
  const [innerSelectedKeys, setInnerSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const keys = selectedKeys.length ? selectedKeys : guard.keys;

    setInnerSelectedKeys(keys);
    onSelect(keys);
  }, []);

  return (
    <Stack
      flexWrap="wrap"
      flexDirection={'row'}
      gap="md"
      paddingInline={'sm'}
      marginBlock={'xs'}
    >
      {keysWithAlias.map(({ key }) => (
        <Stack
          key={key}
          gap="sm"
          alignItems={'center'}
          className={backgroundClass({
            isSelected: innerSelectedKeys.includes(key),
          })}
          data-isselected={innerSelectedKeys.includes(key)}
        >
          <Text variant="code" size="smallest" className={labelClass}>
            <Checkbox
              isSelected={innerSelectedKeys.includes(key)}
              onChange={(isSelected) => {
                let updated = [...innerSelectedKeys];
                if (isSelected) {
                  updated = [...innerSelectedKeys, key];
                } else {
                  updated = innerSelectedKeys.filter((k) => k !== key);
                }
                setInnerSelectedKeys(updated);
                onSelect(updated);
              }}
            >
              {shorten(key!)}
            </Checkbox>
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};
