import React, { FC, memo, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import s from './CommandSigning.module.css';
import GlobalAddDeleteInput from '../../../GlobalAddDeleteInput/GlobalAddDeleteInput';
import FormikController from '../../../FormikController/FormikController';
import ButtonsComponent from './components/ButtonsComponent';
import { useDebounce } from '../../../../../services/debounce';

const signingValidation = Yup.object({
  account: Yup.string().trim().required('Field is required'),
  keyType: Yup.string().required('Field is required'),
  publicKey: Yup.string().trim().required('Field is required'),
  privateKey: Yup.string().when('keyType', {
    is: 'pair',
    then: Yup.string().required('Field is required'),
  }),
  signatureKey: Yup.string().when('keyType', {
    is: 'signature',
    then: Yup.string().required('Field is required'),
  }),
  keyFile: Yup.mixed(),
  capabilities: Yup.array().of(Yup.string()),
});

interface Props {
  account?: string;
  publicKey?: string;
  privateKey?: string;
  signatureKey?: string;
  capabilities?: string[];
  onSigningComplete: (values: any) => void;
  onGenerateKeys: () => void;
  onSelectKeyFile: (file: File) => void;
}

const CommandSigning: FC<Props> = props => {
  const formik = useFormik({
    initialValues: {
      account: props?.account || '',
      keyType: props.signatureKey ? 'signature' : 'pair',
      publicKey: props?.publicKey || '',
      privateKey: props?.privateKey || '',
      signatureKey: props.signatureKey || '',
      capabilities: props.capabilities || [],
      keyFile: null,
    },
    onSubmit: props.onSigningComplete,
    validationSchema: signingValidation,
    validateOnBlur: true,
    validateOnMount: false,
    validateOnChange: false,
  });

  const debounceValues = useDebounce(formik.values, 250);
  useEffect(() => {
    props.onSigningComplete(debounceValues);
  }, [props.onSigningComplete, debounceValues]);

  return (
    <div className={s.signingContainer}>
      <form className={s.signingContainerForm} onSubmit={formik.handleSubmit}>
        <FormikController
          control="input"
          head="Sender Account"
          hint="senderAccount"
          name="account"
          type="text"
          placeholder="Sender Account"
          value={formik.values.account}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.account}
        />
        <div className={s.senderBlock}>
          <div className={s.radioGroup}>
            <FormikController
              control="radio"
              id="pairRadio"
              hint="keyPair"
              label="Key Pair"
              name="keyType"
              value="pair"
              checked={formik.values.keyType === 'pair'}
              onChange={() => formik.setFieldValue('keyType', 'pair')}
            />
            <div className={s.signatureRadio}>
              <FormikController
                control="radio"
                id="signatureRadio"
                hint="signature"
                label="Signature"
                name="keyType"
                value="signature"
                checked={formik.values.keyType === 'signature'}
                onChange={() => formik.setFieldValue('keyType', 'signature')}
              />
            </div>
          </div>
          <div className={s.keyInputGroup}>
            <div className={s.public}>
              <FormikController
                control="input"
                name="publicKey"
                type="text"
                placeholder="Public Key"
                value={formik.values.publicKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.publicKey}
              />
            </div>
            {formik.values.keyType === 'signature' ? (
              <div className={s.public}>
                <FormikController
                  control="input"
                  name="signatureKey"
                  type="text"
                  placeholder="TX Signature"
                  value={formik.values.signatureKey}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.signatureKey}
                />
              </div>
            ) : (
              <div className={s.public}>
                <FormikController
                  control="input"
                  name="privateKey"
                  type="text"
                  placeholder="Private Key"
                  value={formik.values.privateKey}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.privateKey}
                />
              </div>
            )}
          </div>
          <ButtonsComponent
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fileValue={formik.values.keyFile || ''}
            onSelectFile={props.onSelectKeyFile}
            onGenerateKeys={props.onGenerateKeys}
          />
        </div>
      </form>
      <GlobalAddDeleteInput
        head="Capabilities"
        hint="capability"
        name="capabilities"
        values={formik.values.capabilities}
        onChangeValues={formik.setFieldValue}
      />
    </div>
  );
};

export default memo(CommandSigning);
