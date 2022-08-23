import React, { FC, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Info from 'components/common/GlobalIcons/Info';
import s from './Transfer.module.css';
import FormikController from '../../../FormikController/FormikController';
import SubmitButton from '../SubmitButton/SubmitButton';
import MainnetArrow from './Icons/MainnetArrow';
import DisabledInput from './components/DisabledInput/DisabledInput';
import { useDebounce } from '../../../../../services/debounce';

const transferValidation = Yup.object({
  sender: Yup.string().trim().required('Field is required'),
  sourceChainId: Yup.string().trim().required('Field is required'),
  receiver: Yup.string().trim().required('Field is required'),
  targetChainId: Yup.string().trim().required('Field is required'),
  amount: Yup.string().trim().required('Field is required'),
  signature: Yup.string().trim().required('Field is required'),
  publicKey: Yup.string().trim().required('Field is required'),
  predicate: Yup.string().trim().required('Field is required'),
});

interface Props {
  chainData: {
    key: string;
    value: string;
    text: string;
  }[];
  predicates: {
    key: string;
    value: string;
    text: string;
  }[];
  predicate: string;
  signature: string;
  signatureHash: string;
  publicKey: string;
  instance: string;
  sender: string;
  amount: string;
  receiver: string;
  sourceChainId: string;
  targetChainId: string;
  onCompleteTransferValues: (values: any) => void;
  onDoTransfer: () => void;
}

const Transfer: FC<Props> = React.memo(props => {
  const formik = useFormik({
    initialValues: {
      sender: props.sender || '',
      receiver: props.receiver || '',
      sourceChainId: props.sourceChainId || '0',
      amount: props.amount || '',
      signature: props.signature || '',
      publicKey: props.publicKey || '',
      targetChainId: props.targetChainId || '0',
      predicate: props.predicate || 'keys-all',
    },
    onSubmit: props.onCompleteTransferValues,
    validationSchema: transferValidation,
    validateOnBlur: true,
    validateOnChange: false,
  });

  const debounceValues = useDebounce(formik.values, 250);
  useEffect(() => {
    props.onCompleteTransferValues(debounceValues);
  }, [props.onCompleteTransferValues, debounceValues]);

  const onHashPress = useCallback(() => {
    if (props.signatureHash) {
      if (!navigator.clipboard) {
        const textArea = document.createElement('textarea');
        textArea.value = props.signatureHash;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          // eslint-disable-next-line no-empty
        } catch (err) {}
        document.body.removeChild(textArea);
        return;
      }
      navigator.clipboard.writeText(props.signatureHash);
    }
  }, [props.signatureHash]);

  return (
    <div className={s.transferContainer}>
      <form className={s.transferFormContainer} onSubmit={formik.handleSubmit}>
        <div className={s.sender}>
          <div className={`${s.transferController} ${s.backgroundNone}`}>
            <FormikController
              control="input"
              head="Sender"
              name="sender"
              placeholder="Sender ID"
              type="text"
              value={formik.values.sender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.sender}
            />
            <FormikController
              control="select"
              head=" "
              name="sourceChainId"
              data={props.chainData}
              value={formik.values.sourceChainId}
              onChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className={s.senderContainerRow} />
          <FormikController
            control="input"
            head="Amount"
            name="amount"
            placeholder="Amount to Send"
            type="text"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.amount}
          />
          <FormikController
            control="input"
            head="Signature"
            name="signature"
            placeholder="Enter Private Key"
            type="text"
            value={formik.values.signature}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.signature}>
            {props.signatureHash ? (
              <button onClick={onHashPress} type="button" className={s.getHash}>
                GET HASH
              </button>
            ) : null}
          </FormikController>
        </div>
        <div className={s.mainnet}>
          <DisabledInput head=" " value={props.instance} />
          <div className={s.mainnetArrow}>
            <MainnetArrow />
          </div>
        </div>
        <div className={s.receiver}>
          <div className={`${s.transferController} ${s.receiverContainer}`}>
            <FormikController
              control="input"
              head="Receiver"
              name="receiver"
              placeholder="Receiver ID"
              type="text"
              value={formik.values.receiver}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.receiver}
            />
            <FormikController
              control="select"
              head=" "
              name="targetChainId"
              data={props.chainData}
              value={formik.values.targetChainId}
              onChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className={`${s.transferController} ${s.receiverKeyContainer}`}>
            <FormikController
              control="input"
              head="Receiver Keyset"
              name="publicKey"
              placeholder="Receiver Public Key"
              type="text"
              value={formik.values.publicKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.publicKey}
            />
            <FormikController
              control="select"
              head=" "
              name="predicate"
              data={props.predicates}
              value={formik.values.predicate}
              onChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className={s.coinInfo}>
            <div className={s.infoSvg}>
              <Info height="40" width="44" fill="#f6cc62" />
            </div>
            <span className={s.coinText}>
              {`Blockchain transactions are irreversable. If you make a mistake,
              your coins may not be recoverable. Before you transfer large sums,
              it is always best to do a small test transaction first and then
              send those coins back to the sender to verify that the receiver's
              account works as expected.`}
            </span>
          </div>
          <SubmitButton onPress={props.onDoTransfer} title="Make Transfer" />
        </div>
      </form>
    </div>
  );
});

export default Transfer;
