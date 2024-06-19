import React, { FC } from 'react';
import { Card, Divider, Button } from '@kadena/react-ui';
import * as styles from '@/styles/create-token.css';
import { IUnsignedCommand,ICommand } from "@kadena/client"

interface SendTransactionFormProps {
  send: () => void;
  preview: () => void;
  transaction?: IUnsignedCommand | ICommand;
}

const SendTransaction: FC<SendTransactionFormProps> = ({ send, preview, transaction}) => (
    <div >
        <Card>
          Transaction
          {JSON.stringify(transaction)}
          <Divider />
          <Button onPress={preview}>Preview Transaction</Button>
          <Button onPress={send}>Send transaction</Button>
        </Card>   
    </div>
);

export default SendTransaction;