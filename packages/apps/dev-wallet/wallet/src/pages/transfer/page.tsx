import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTransferTransaction } from "@/utils/account";
import { ChainId } from "@kadena/client";
import { encode } from "@/utils/encode";
import {
  Box,
  Button,
  Input,
  InputWrapper,
  Label,
  Stack,
  TextField,
} from "@kadena/react-ui";
import { useNavigate } from "react-router-dom";
import { useCrypto } from "@/hooks/crypto.context";

// @TODO
const chainIds: ChainId[] = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
];

interface FormValues {
  senderKey: string;
  receiverAccount: string;
  amount: number;
  chainId: ChainId;
}

const validationSchema = yup.object().shape({
  senderKey: yup.string().required("This field is required"),
  receiverAccount: yup.string().required("This field is required"),
  amount: yup
    .number()
    .typeError("Amount should be a number")
    .required("This field is required")
    .positive("Amount should be positive"),
  chainId: yup
    .string<ChainId>()
    .required("This field is required")
    .oneOf(chainIds), // @TODO get this from an enum or something
});

export default function Transfer() {
  const navigate = useNavigate();
  const { publicKeys } = useCrypto();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const transaction = createTransferTransaction({
      sender: `k:${values.senderKey}`, // @TODO
      senderKey: values.senderKey,
      receiver: values.receiverAccount,
      amount: values.amount,
      chainId: values.chainId,
    });

    navigate(`/sign/${encode(JSON.stringify(transaction))}`);
  };

  return (
    <main>
      <Box margin="$md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" gap="$md">
            <Box>
              <Label htmlFor="senderKey">From pubKey</Label>
              <br />
              {/* @TODO needs to be account */}
              <select
                aria-label="From pubKey"
                id="senderKey"
                {...register("senderKey")}
              >
                <option value="">Select...</option>
                {publicKeys.map((publicKey) => (
                  <option key={publicKey}>{publicKey}</option>
                ))}
              </select>
              {errors?.senderKey && <p>{errors.senderKey.message}</p>}
            </Box>

            <TextField
              inputProps={{
                id: "receiverAccount",
                ...register("receiverAccount"),
              }}
              label="Receiver account"
              status={errors.receiverAccount ? "negative" : undefined}
              helperText={errors?.receiverAccount?.message}
            />

            <InputWrapper
              htmlFor="amount"
              label="Amount"
              status={errors.amount ? "negative" : undefined}
              helperText={errors?.amount?.message}
            >
              <Input
                id="amount"
                type="number"
                step="any"
                {...register("amount")}
              />
            </InputWrapper>

            <Box>
              <Label htmlFor="chainId">ChainID</Label>
              <br />
              <select
                id="chainId"
                aria-label="ChainID"
                {...register("chainId")}
              >
                <option value="">Select...</option>
                {chainIds.map((chainId) => (
                  <option key={chainId}>{chainId}</option>
                ))}
              </select>
              {errors?.chainId && <p>{errors.chainId.message}</p>}
            </Box>

            <Box>
              <Button type="submit">Submit</Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </main>
  );
}
