import React, { FC, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useWindowSize } from 'utils/window';
import { removeUnfinishedChain } from 'services/coin';
import Notification from './Notification/Notification';
import s from '../CheckBalance/CheckBalance.module.css';
import style from './ChainTransfer.module.css';
import SubmitButton from '../SubmitButton/SubmitButton';
import FormikController from '../../../FormikController/FormikController';
import { useDebounce } from '../../../../../services/debounce';
import GlobalDisabledInput from '../../../GlobalDisabledInput/GlobalDisabledInput';
import HistoryPage from '../CheckBalance/components/HistoryPage/HistoryPage';

const keyValidation = Yup.object({
  sourceChainId: Yup.string().trim().required('Field is required'),
  targetChainId: Yup.string().trim().required('Field is required'),
  requestKey: Yup.string().trim().required('Field is required'),
});

interface Props {
  chainData: {
    key: string;
    value: string;
    text: string;
  }[];
  instance: string;
  server: string;
  requestKey: string;
  sender: string;
  receiver: string;
  targetChainId: string;
  sourceChainId: string;
  guard: string;
  amount: string;
  onFinishTransfer: () => void;
  onCompleteKey: (values: any) => void;
  transferResult: null | {
    status: string;
    requestKey: string;
  };
}

export interface IUnfinishedChains {
  requestKey: string;
  sourceChainId: string;
  targetChainId: string;
}

const ChainTransfer: FC<Props> = React.memo(props => {
  const [width] = useWindowSize();

  const formik = useFormik({
    initialValues: {
      requestKey: props.requestKey || '',
      sourceChainId: props.sourceChainId || '',
      targetChainId: props.targetChainId || '',
    },
    onSubmit: props.onCompleteKey,
    validationSchema: keyValidation,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const debounceValues = useDebounce(formik.values, 250);
  useEffect(() => {
    props.onCompleteKey(debounceValues);
  }, [props.onCompleteKey, debounceValues]);

  const transferResultData = useMemo(
    () =>
      props.transferResult
        ? [
            {
              title: 'Transfer Result',
              items: [
                {
                  name: 'Status',
                  value: props.transferResult.status || '',
                },
                {
                  name: 'Request Key or Pact ID',
                  value: props.transferResult.requestKey || '',
                },
              ],
            },
          ]
        : [],
    [props.transferResult],
  );

  const [unfinishedChains, setUnfinishedChains] = useState<IUnfinishedChains[]>(
    JSON.parse(localStorage.getItem('unfinishedChains') || '[]'),
  );

  const isUnfinishedChains = useMemo<boolean>(
    () => !!unfinishedChains.length,
    [unfinishedChains],
  );

  return (
    <>
      <div className={s.container}>
        <div className={s.checkBalanceContainer}>
          {width <= 860 && isUnfinishedChains && (
            <div className={s.notificationContainer}>
              <Notification
                unfinishedChains={unfinishedChains}
                handleClick={setUnfinishedChain}
                handleRemove={handleRemove}
              />
            </div>
          )}
          <form className={s.balanceForm} onSubmit={formik.handleSubmit}>
            <div
              className={`${s.balanceController} ${style.chainTransferController}`}>
              <GlobalDisabledInput
                head="Server"
                hint="server"
                value={`${props.server} - ${props.instance}`}
              />
              <FormikController
                control="input"
                head="Request Key"
                name="requestKey"
                placeholder="Enter Request Key"
                type="text"
                value={formik.values.requestKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.requestKey}
              />
              <FormikController
                control="select"
                head="Source Chain ID"
                hint="chain"
                name="sourceChainId"
                placeholder="Chain ID"
                data={props.chainData}
                value={formik.values.sourceChainId}
                onChange={formik.handleChange}
                setFieldValue={formik.setFieldValue}
                onBlur={formik.handleBlur}
                error={formik.errors.sourceChainId}
              />
              <FormikController
                control="select"
                head="Target Chain ID"
                hint="chain"
                name="targetChainId"
                placeholder="Chain ID"
                data={props.chainData}
                value={formik.values.targetChainId}
                onChange={formik.handleChange}
                setFieldValue={formik.setFieldValue}
                onBlur={formik.handleBlur}
                error={formik.errors.targetChainId}
              />
              {props.sender ? (
                <GlobalDisabledInput head="Sender" value={props.sender} />
              ) : null}
              {props.receiver ? (
                <GlobalDisabledInput head="Receiver" value={props.receiver} />
              ) : null}
              {props.guard ? (
                <GlobalDisabledInput
                  head="Receiver Guard"
                  value={props.guard}
                />
              ) : null}
              {props.amount ? (
                <GlobalDisabledInput head="Amount" value={props.amount} />
              ) : null}
            </div>
            <SubmitButton
              onPress={props.onFinishTransfer}
              title="Finish Cross Chain Transfer"
            />
          </form>
        </div>
        <div className={s.containerHistory}>
          {width > 860 && isUnfinishedChains && (
            <Notification
              unfinishedChains={unfinishedChains}
              handleClick={setUnfinishedChain}
              handleRemove={handleRemove}
            />
          )}
          <HistoryPage data={transferResultData} />
        </div>
      </div>
    </>
  );

  function setUnfinishedChain(key: string) {
    const chain = unfinishedChains.find(item => item.requestKey !== key);
    if (chain) {
      formik.setValues({
        requestKey: chain.requestKey,
        sourceChainId: chain.sourceChainId,
        targetChainId: chain.targetChainId,
      });
    }
  }

  function handleRemove(key: string) {
    const filterChains = removeUnfinishedChain(key);
    setUnfinishedChains(filterChains);
  }
});

export default ChainTransfer;
