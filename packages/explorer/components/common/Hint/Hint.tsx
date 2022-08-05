import React, { FC, memo, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { tooltipTexts } from './Tooltip/tooltipTexts';
import s from './Hint.module.css';

interface IProps {
  messageKey: string;
  id: string;
}

const Hint: FC<IProps> = ({ messageKey, id }) => {
  const {
    [messageKey]: { head, text },
  } = tooltipTexts;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={s.hintContainer}>
      <span data-tip data-for={id}>
        ?
      </span>
      {isMounted && (
        <ReactTooltip
          id={id}
          place="top"
          effect="solid"
          backgroundColor="#fff"
          textColor="#000"
          className={s.tooltip}>
          <div className={s.tooltipContainer}>
            <p className={s.tooltipHead}>{head}</p>
            <span className={s.tooltipText}>{text}</span>
          </div>
        </ReactTooltip>
      )}
    </div>
  );
};

export default memo(Hint);
