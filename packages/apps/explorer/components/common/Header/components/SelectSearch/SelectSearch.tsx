import React, { FC, memo, useCallback, useMemo } from 'react';
import ArrowIcon from 'components/common/GlobalIcons/ArrowIcon';
import { useWindowSize } from 'utils/window';
import { SearchType } from 'network/search';
import ReactSelect, {
  components,
  GroupBase,
  SingleValueProps,
} from 'react-select';
import { chain } from 'lodash';
import s from './SelectSearch.module.css';
import { options } from './config';
import { useStyles } from './styles';

const IndicatorsContainer: FC = memo(() => (
  <ArrowIcon height="10" width="10" fill="#975E9A" />
));

const SingleValue: FC<SingleValueProps> = memo(props => {
  const current = props.getValue()[0] as Record<string, string>;
  return (
    <components.SingleValue {...props}>
      {current?.labelInput || current?.label}
    </components.SingleValue>
  );
});

const formatGroupLabel = (data: GroupBase<unknown>) => {
  if (!data.label) {
    return undefined;
  }
  return (
    <div className={s.label}>
      <span>{data.label}</span>
    </div>
  );
};

const SelectSearch: FC<{
  type: SearchType;
  setType: (type: SearchType) => void;
}> = ({ type, setType }) => {
  const [widthSize] = useWindowSize();

  const onHandleSelect = useCallback((newValue: unknown) => {
    setType((newValue as Record<string, string>).value as SearchType);
  }, []);

  const memoFormatGroupLabel = useCallback(formatGroupLabel, []);

  const chooseValue = useMemo(() => {
    return chain(options)
      .map('options')
      .flatten()
      .find({ value: type })
      .value();
  }, [type]);

  const width = useMemo(() => {
    return widthSize > 1024
      ? chooseValue?.width
      : widthSize > 300
      ? chooseValue?.minWidth
      : 66;
  }, [chooseValue, widthSize]);

  const styles = useStyles(widthSize);

  return (
    <div style={{ width, minWidth: width }}>
      <ReactSelect
        instanceId="search"
        value={chooseValue}
        options={options}
        onChange={onHandleSelect}
        styles={styles}
        components={{
          IndicatorsContainer,
          SingleValue,
        }}
        formatGroupLabel={memoFormatGroupLabel}
        isSearchable={false}
      />
    </div>
  );
};

export default memo(SelectSearch);
