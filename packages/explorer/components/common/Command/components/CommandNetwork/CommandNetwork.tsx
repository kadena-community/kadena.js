import React, { FC, memo, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import s from './CommandNetwork.module.css';
import FormikController from '../../../FormikController/FormikController';
import GlobalDisabledInput from '../../../GlobalDisabledInput/GlobalDisabledInput';
import { useDebounce } from '../../../../../services/debounce';

const networkValidation = Yup.object({
  chainId: Yup.string().trim().required('Field is required'),
});

interface Props {
  server: string;
  instance: string;
  chainId: string;
  chainIds: { key: string; value: string; text: string }[];
  onCompleteNetwork: (values: any) => void;
}

const CommandNetwork: FC<Props> = props => {
  const formik = useFormik({
    initialValues: {
      chainId: props.chainId || '',
    },
    onSubmit: props.onCompleteNetwork,
    validationSchema: networkValidation,
    validateOnBlur: true,
    validateOnChange: false,
  });

  const debounceValues = useDebounce(formik.values, 250);
  useEffect(() => {
    props.onCompleteNetwork(debounceValues);
  }, [props.onCompleteNetwork, debounceValues]);

  return (
    <div className={s.networkContainer}>
      <form className={s.networkContainerForm} onSubmit={formik.handleSubmit}>
        <FormikController
          control="select"
          head="Chain ID"
          hint="chain"
          name="chainId"
          placeholder="Chain ID"
          data={props.chainIds}
          value={formik.values.chainId}
          onChange={formik.handleChange}
          setFieldValue={formik.setFieldValue}
          onBlur={formik.handleBlur}
          error={formik.errors.chainId}
        />
        <GlobalDisabledInput head="Server" hint="server" value={props.server} />
      </form>
      <GlobalDisabledInput
        head="Version"
        hint="version"
        value={props.instance}
      />
    </div>
  );
};

export default memo(CommandNetwork);
