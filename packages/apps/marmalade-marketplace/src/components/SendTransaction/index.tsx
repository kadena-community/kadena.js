import React, { FC, MouseEventHandler, useEffect, useState } from 'react';
import { Card, Divider, Button, Dialog, PressEvent, Notification, NotificationFooter, NotificationButton, NotificationHeading,} from '@kadena/kode-ui';
import { MonoCheck, MonoClose } from '@kadena/kode-icons';
import * as styles from '@/styles/create-token.css';
import { IUnsignedCommand, ICommand, ITransactionDescriptor, ICommandResult } from "@kadena/client"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import TransactionPreview from '@/components/TransactionPreview';
interface SendTransactionFormProps {
  preview: () => Promise<void | ICommandResult>
  send: () => Promise<void | ITransactionDescriptor>
  poll: (req: any) => Promise<any>;
  transaction?: IUnsignedCommand | ICommand;
}

const SendTransaction: FC<SendTransactionFormProps> = ({ send, preview, poll, transaction}) =>{
  const [previewStatus, setPreviewStatus] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [requestKey, setRequestKey] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const onCancelPress = () => {
    router.back();
  };

  useEffect(() => {
    if (searchParams.has('returnUrl')) {
      const url = searchParams.get('returnUrl');
      if (url) {
        setReturnUrl(url);
      }
    }
  }, [searchParams]);

  const handlePreview = async () => {
    try {
      const res: any = await preview();
      const result = res?.result.status === "success" ? res?.result.status : undefined;
      if (result === "success") {
        setError(false);
        setPreviewStatus(true);
        setIsPreview(true)
        setResult(JSON.stringify(res?.result))
      } else {
        throw new Error(JSON.stringify(res))
      }
    } catch (e) {
      setError(true);
      setIsPreview(true)
      setPreviewStatus(true);
      setResult(JSON.parse(e.message).result.error.message)
      console.error('Error previewing transaction:', e);
    }
  };

  const handleSend = async () => {
    try {
      setResult("");
      const res: any = await send();
      const { requestKey } = res;
      setRequestKey(requestKey);
      setLoadingStatus(true);
      const pollResponse = await poll(res);
      const pollResult = pollResponse[requestKey];
      const result = pollResult?.result.status === "success" ? pollResult?.result.status : undefined;
      if (result === "success") {
        setIsPreview(false);
        setPreviewStatus(true)
        setResult(JSON.stringify(pollResult.result));
        if (returnUrl) {
          window.location.href = returnUrl;
        }
      } else {
        throw new Error(JSON.stringify(pollResult))
      }
      setLoadingStatus(false);
    } catch (error) {
      setError(true);
      setLoadingStatus(false);
      console.error('Error sending transaction:', error);
    }
  };

  const renderTransactionDetails = () => {
    if (!transaction) return null;
    const parsedTransaction = JSON.parse(transaction.cmd);
    const { meta, networkId, payload, signers } = parsedTransaction;
    return (
      <div className={styles.transactionDetails}>
        <h3 className={styles.transactionDetailsHeader}>Transaction Details</h3>
        <p><strong>Meta:</strong> {JSON.stringify(meta)}</p>
        <p><strong>Network ID:</strong> {networkId}</p>
        <p><strong>Payload:</strong></p>
        <div style={{ marginLeft: 20 }}>
          {payload.exec?.["code"] && <p><strong>Exec Code:</strong> {payload.exec.code}</p>}
          {payload.exec?.["const"] && <p><strong>Cont Code:</strong> {payload.exec.cont}</p>}
        </div>
        <p><strong>Signers:</strong></p>
        <ul style={{ marginLeft: 20 }}>
          {signers.map((signer: any, index: any) => (
            <li key={index}>
              <p><strong>Public Key:</strong> {signer.pubKey}</p>
              <p><strong>Scheme:</strong> {signer.scheme}</p>
              <p><strong>Contract List:</strong></p>
              <ul style={{ marginLeft: 20 }}>
                {signer.clist.map((contract: any, idx: any) => (
                  <li key={idx}>
                    <p><strong>Name:</strong> {contract.name}</p>
                    <p><strong>Arguments:</strong> {JSON.stringify(contract.args)}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p><strong>Hash:</strong> {transaction.hash}</p>
      </div>
    );
  };

return(
  <div >
    <Card >
      {renderTransactionDetails()}
    </Card>

    <div className={styles.buttonRow}>
      <Button variant="outlined" onPress={onCancelPress}>
        Cancel
      </Button>
      <Button className={styles.button} onPress={handlePreview} loadingLabel="Transaction in Progress.."  isLoading={loadingStatus} >Preview Transaction</Button>
    </div>
    {previewStatus && <TransactionPreview sendTransaction={handleSend} preview={isPreview} showNotification={previewStatus} setShowNotification={setPreviewStatus} error={error} txResponse={result}/>}
  </div>
);}

export default SendTransaction;
