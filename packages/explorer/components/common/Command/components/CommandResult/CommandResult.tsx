import React, { FC, memo, useMemo, useState } from 'react';
import Select from 'components/common/Select/Select';
import CommandInfo from './components/CommandInfo';
import s from './CommandResult.module.css';

interface Props {
  text: string;
  curl: string;
  yaml: string;
  host: string;
}

const options = [
  {
    value: 'JSON',
    label: 'JSON',
    title: 'JSON Request Object',
  },
  {
    value: 'CURL cmd',
    label: 'CURL cmd',
    title: 'Curl Command',
  },
  {
    value: 'YAML',
    label: 'YAML',
    title: 'YAML Request Format',
  },
];

const CommandResult: FC<Props> = props => {
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>(
    options[0],
  );

  const selectedItem = useMemo(
    () => options.find(item => item.value === selectedOption.value),
    [selectedOption],
  );
  const selectedValue = useMemo(() => {
    switch (selectedOption.value) {
      case 'JSON':
        return props.text;
      case 'CURL cmd':
        return props.curl;
      case 'YAML':
        return props.yaml;
      default:
        return '';
    }
  }, [selectedOption, props]);

  return (
    <div className={s.resultContainer}>
      <div className={s.json}>
        <Select
          options={options}
          value={selectedOption}
          setValue={setSelectedOption}
        />
      </div>
      <CommandInfo
        title={selectedItem?.title || ''}
        value={selectedValue || ''}
        host={props.host}
      />
    </div>
  );
};

export default memo(CommandResult);
