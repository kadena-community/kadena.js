import React, { FC, memo, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import s from './CommandMetaData.module.css';
import FormikController from '../../../FormikController/FormikController';
import GlobalDisabledInput from '../../../GlobalDisabledInput/GlobalDisabledInput';
import DollarIcon from './Icons/DollarIcon';
import DropIcon from './Icons/DropIcon';
import { useDebounce } from '../../../../../services/debounce';

const metaValidation = Yup.object({
  creationTime: Yup.number().required('Field is required'),
  ttl: Yup.number().required('Field is required'),
  gasPrice: Yup.string().trim().required('Field is required'),
  gasLimit: Yup.string().trim().required('Field is required'),
});

interface Props {
  chainId: string;
  account: string;
  ttl: number;
  creationTime: number;
  gasPrice: number;
  gasLimit: number;
  onCompleteMeta: (values: any) => void;
}

const CommandMetaData: FC<Props> = props => {
  const formik = useFormik({
    initialValues: {
      creationTime: props.creationTime,
      ttl: props.ttl,
      gasPrice: props.gasPrice,
      gasLimit: props.gasLimit,
    },
    onSubmit: props.onCompleteMeta,
    validationSchema: metaValidation,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: false,
  });

  const debounceValues = useDebounce(formik.values, 250);
  useEffect(() => {
    props.onCompleteMeta(debounceValues);
  }, [props.onCompleteMeta, debounceValues]);

  return (
    <div className={s.metaContainer}>
      <form className={s.metaContainerForm} onSubmit={formik.handleSubmit}>
        <GlobalDisabledInput
          head="Chain ID"
          hint="chain"
          value={props.chainId || 'Select Chain Id'}
        />
        <GlobalDisabledInput
          head="Sender"
          hint="sender"
          value={props.account || 'Provide Sender Details'}
        />
        <FormikController
          control="input"
          head="Creation Time"
          hint="creationTime"
          name="creationTime"
          type="text"
          placeholder="Creation Time"
          value={formik.values.creationTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.creationTime}
        />
        <FormikController
          control="input"
          head="TTL"
          hint="ttl"
          name="ttl"
          type="text"
          placeholder="TTL"
          value={formik.values.ttl}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.ttl}
        />
        <FormikController
          control="input"
          head="Gas Price"
          hint="gasPrice"
          name="gasPrice"
          type="text"
          placeholder="Gas Price"
          value={formik.values.gasPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.gasPrice}>
          <DollarIcon />
        </FormikController>
        <FormikController
          control="input"
          head="Gas Limit"
          hint="gasLimit"
          name="gasLimit"
          type="text"
          placeholder="Gas Limit"
          value={formik.values.gasLimit}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.gasLimit}>
          <DropIcon />
        </FormikController>
      </form>
    </div>
  );
};

export default memo(CommandMetaData);
