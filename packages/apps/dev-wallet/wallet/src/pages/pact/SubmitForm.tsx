import { Box, Button, Stack, Text } from "@kadena/react-ui";
import { submit } from "@/utils/helpers";
import { FC, useState } from "react";
import { uploadModuleTransaction } from "./pact.utils";
import { PreviewFormValues } from "./PreviewForm";
import { useCrypto } from "@/hooks/crypto.context";

type PreviewFormProps = {
  values: PreviewFormValues;
  onCancel: () => void;
};

export const SubmitForm: FC<PreviewFormProps> = ({ values, onCancel }) => {
  const wallet = useCrypto();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const onSendLocalResult = async () => {
    const publicKey = values.publicKey;

    const result: any = await submit("l1")(
      await uploadModuleTransaction({
        moduleFile: values.code,
        data: JSON.parse(values.contractData),
        chainId: values.chainId,
        networkdId: values.networkdId,
        publicKey,
        sign: wallet.sign,
        senderAccount: values.senderAccount,
        capabilities: values.capabilities
          .replace(/\r/g, "")
          .split(/\n/g)
          .filter(Boolean),
      })
    ).catch((error) => {
      console.log("catch", error);
      return { error: error.message };
    });

    console.log(result);

    if (result.error) {
      setResult({
        success: false,
        message: result.error,
      });
    } else if (result.requestKey) {
      setResult({
        success: true,
        message: `Request key: ${result.requestKey}`,
      });
    } else {
      setResult({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  return (
    <div>
      <Stack
        direction="row"
        margin="$md"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box marginRight="$2">pact module file</Box>
        {values.file?.item(0)?.name}
      </Stack>
      <Stack
        direction="row"
        margin="$md"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box marginRight="$2">module data json</Box>
        <textarea
          id="contractData"
          style={{
            width: "100%",
            minHeight: "120px",
            resize: "vertical",
          }}
          defaultValue={values.contractData}
        />
      </Stack>
      <Stack
        direction="row"
        margin="$md"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box marginRight="$2">Chain ID</Box>
        {values.chainId}
      </Stack>
      <Stack
        direction="row"
        margin="$md"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box marginRight="$2">Network ID</Box>
        {values.networkdId}
      </Stack>
      <Stack
        direction="row"
        margin="$md"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box marginRight="$2">Public Key</Box>
        {values.publicKey}
      </Stack>
      <Stack direction="column" margin="$md" justifyContent="flex-start">
        {result && (
          <Text>
            {result.success ? "Success: " : "Error: "}
            {result.message}
          </Text>
        )}
      </Stack>
      <Stack direction="row" margin="$md" justifyContent="flex-start">
        <Button onClick={onSendLocalResult}>Upload</Button>
        <Button onClick={onCancel}>Back</Button>
      </Stack>
    </div>
  );
};
