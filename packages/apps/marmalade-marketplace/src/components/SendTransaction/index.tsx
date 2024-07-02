import React, { FC, useState } from 'react';
import { Card, Divider, Button, Dialog} from '@kadena/kode-ui';
import * as styles from '@/styles/create-token.css';
import { IUnsignedCommand, ICommand, ITransactionDescriptor, ICommandResult } from "@kadena/client"

interface SendTransactionFormProps {
  preview: () => Promise<void | ICommandResult>
  send: () => Promise<void | ITransactionDescriptor>
  poll: (req:any) => Promise<any>;
  transaction?: IUnsignedCommand | ICommand;
}

const SendTransaction: FC<SendTransactionFormProps> = ({ send, preview, poll, transaction}) =>{
  const [previewStatus, setPreviewStatus] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [requestKey, setRequestKey] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  interface Transaction {
    cmd: string;
    hash: string;
    sigs: { sig: string }[];
    nonce: string;
  }

  const handlePreview = async () => {
    try {
      const res: any = await preview();
      const result = res?.result.status === "success" ?  res?.result.status : undefined;
      if (result==="success") {
        setPreviewStatus(true);
        setResult(JSON.stringify(res?.result))
      } else {
        throw new Error(JSON.stringify(res))
      }
    } catch (e) {
      setError(e.message);
      console.error('Error previewing transaction:', e);
    }
  };

  const handleSend = async () => {
    try {
      const res:any  = await send();
      setRequestKey(res);
      setLoadingStatus(true);
      const pollResult = await poll(res);
      setLoadingStatus(false);
    } catch (error) {
      setError(JSON.stringify(error));

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
          <p><strong>Exec Code:</strong> {payload.exec.code}</p>
        </div>
        <p><strong>Signers:</strong></p>
        <ul style={{ marginLeft: 20 }}>
          {signers.map((signer:any, index:any) => (
            <li key={index}>
              <p><strong>Public Key:</strong> {signer.pubKey}</p>
              <p><strong>Scheme:</strong> {signer.scheme}</p>
              <p><strong>Contract List:</strong></p>
              <ul style={{ marginLeft: 20 }}>
                {signer.clist.map((contract:any, idx:any) => (
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
      <Divider />
      <div className={styles.buttonContainer}>
        {!previewStatus ?
          (<Button className={styles.button} onPress={handlePreview}>Preview Transaction</Button>)
        : (<Button className={styles.button} onPress={handleSend} loadingLabel="Transaction in Progress.." isLoading={loadingStatus}>Send Transaction</Button>)
        }
      </div>
    </Card>
    {error && (
      <div className={styles.resultBox}>
        <p>Error: {error}</p>
      </div>
    )}
    <p>{JSON.stringify(result)}</p>
    {error && (
      <div className={styles.errorBox}>
        <p>Error: {error}</p>
      </div>
    )}
  </div>
);}

export default SendTransaction;
