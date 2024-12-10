import { useTransactions } from '@/hooks/transactions';
import { MonoWallet } from '@kadena/kode-icons';
import type { PressEvent } from '@kadena/kode-ui';
import type { FC, ReactElement } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animationIconClass } from './styles.css';
interface IProps {
  onPress: (e: PressEvent) => any;
  trigger: ReactElement;
}

export const SendTransactionAnimation: FC<IProps> = ({ trigger, onPress }) => {
  const { txsButtonRef, txsAnimationRef } = useTransactions();
  const [showAnimation, setShowAnimation] = useState(false);
  const [triggerPos, setTriggerPos] = useState<DOMRect>();
  const [txButtonPos, setTxButtonPos] = useState<DOMRect>();
  const ref = useRef<HTMLDivElement | null>(null);
  const handlePress = async (e: PressEvent) => {
    const tx = await onPress(e);
    if (tx) {
      setShowAnimation(true);

      setTimeout(() => {
        setShowAnimation(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTriggerPos(rect);
    }

    if (txsButtonRef) {
      const rect = txsButtonRef.getBoundingClientRect();
      setTxButtonPos(rect);
    }
  }, [ref.current, txsButtonRef, showAnimation]);

  const style = {
    left: `${triggerPos?.x}px`,
    top: `${triggerPos?.y}px`,
    transition: 'left 1s ease-out, top 1s ease-in',
  };
  if (showAnimation) {
    style.left = `${txButtonPos?.x}px`;
    style.top = `${txButtonPos?.y}px`;
  }

  return (
    <>
      {txsAnimationRef &&
        createPortal(
          <div className={animationIconClass({ showAnimation })} style={style}>
            <MonoWallet />
          </div>,
          txsAnimationRef,
        )}

      <div ref={ref}>
        {React.cloneElement(trigger, {
          ...trigger.props,
          onPress: handlePress,
        })}
      </div>
    </>
  );
};
