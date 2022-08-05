import React, { FC, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import s from './CheckBalance.module.css';
import FormikController from '../../../FormikController/FormikController';
import SubmitButton from '../SubmitButton/SubmitButton';
import HistoryPage from './components/HistoryPage/HistoryPage';
import GlobalDisabledInput from '../../../GlobalDisabledInput/GlobalDisabledInput';
import { useDebounce } from '../../../../../services/debounce';

const balanceValidation = Yup.object({
  token: Yup.string().trim().required('Field is required'),
  account: Yup.string().trim().required('Field is required'),
});

interface Props {
  server: string;
  account?: string;
  token?: string;
  chainBalanceData: any[];
  onCompleteBalance: (values: any) => void;
  onCheckBalance: () => void;
}

const CheckBalance: FC<Props> = React.memo(props => {
  const formik = useFormik({
    initialValues: {
      token: props.token || 'coin',
      account: props.account || '',
    },
    onSubmit: props.onCompleteBalance,
    validationSchema: balanceValidation,
    validateOnBlur: true,
    validateOnChange: false,
  });

  const debounceValues = useDebounce(formik.values, 250);
  useEffect(() => {
    props.onCompleteBalance(debounceValues);
  }, [props.onCompleteBalance, debounceValues]);

  return (
    <div className={s.container}>
      <div className={s.checkBalanceContainer}>
        <form className={s.balanceForm} onSubmit={formik.handleSubmit}>
          <div className={s.balanceController}>
            <GlobalDisabledInput
              head="Server"
              hint="server"
              value={props.server}
            />
            <FormikController
              control="input"
              head="Token Name"
              name="token"
              placeholder="Enter Token Name"
              type="text"
              value={formik.values.token}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.token}
            />
            <FormikController
              control="input"
              head="Your Account Name"
              name="account"
              placeholder="Enter Your Account Name"
              type="text"
              value={formik.values.account}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.account}
            />
          </div>
          <SubmitButton onPress={props.onCheckBalance} title="Check Balance" />
        </form>
      </div>
      <HistoryPage data={props.chainBalanceData} />
    </div>
  );
});

export default CheckBalance;
