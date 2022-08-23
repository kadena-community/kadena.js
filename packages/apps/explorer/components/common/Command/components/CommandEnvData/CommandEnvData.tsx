import React, { FC, memo, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import s from './CommandEnvData.module.css';
import FormikController from '../../../FormikController/FormikController';
import GlobalAddDeleteInput from '../../../GlobalAddDeleteInput/GlobalAddDeleteInput';
import { useDebounce } from '../../../../../services/debounce';

const envValidation = Yup.object({
  keyName: Yup.string().trim().required('Field is required'),
  predicate: Yup.string().trim().required('Field is required'),
  envKeys: Yup.array().of(Yup.string()),
});

interface Props {
  keyName: string;
  predicate: string;
  predicates: { key: string; value: string; text: string }[];
  envKeys: string[];
  onCompleteEnv: (values: any) => void;
}

const CommandEnvData: FC<Props> = props => {
  const formik = useFormik({
    initialValues: {
      keyName: props.keyName || '',
      envKeys: props.envKeys || '',
      predicate: props.predicate || '',
    },
    onSubmit: props.onCompleteEnv,
    validationSchema: envValidation,
    validateOnBlur: true,
    validateOnChange: false,
  });

  const debounceValues = useDebounce(formik.values, 250);
  useEffect(() => {
    props.onCompleteEnv(debounceValues);
  }, [props.onCompleteEnv, debounceValues]);

  return (
    <div className={s.envContainer}>
      <form className={s.envContainerForm} onSubmit={formik.handleSubmit}>
        <FormikController
          control="input"
          head="Keyset Name"
          hint="keysetName"
          name="keyName"
          type="text"
          placeholder="Keyset Name"
          value={formik.values.keyName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.keyName}
        />
        <FormikController
          control="select"
          head="Keyset Predicate"
          hint="keysetPredicate"
          name="predicate"
          placeholder="Keyset Predicate"
          data={props.predicates || []}
          value={formik.values.predicate}
          onChange={formik.handleChange}
          setFieldValue={formik.setFieldValue}
          onBlur={formik.handleBlur}
          error={formik.errors.predicate}
        />
        <GlobalAddDeleteInput
          head="Public Key"
          hint="publicKey"
          name="envKeys"
          values={formik.values.envKeys}
          onChangeValues={formik.setFieldValue}
        />
      </form>
    </div>
  );
};

export default memo(CommandEnvData);
