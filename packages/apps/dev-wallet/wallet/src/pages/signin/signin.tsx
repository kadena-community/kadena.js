import { useCrypto } from "@/hooks/crypto.context";
import {
  Box,
  Button,
  Heading,
  Input,
  Notification,
  Stack,
} from "@kadena/react-ui";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Words from "./words";
import { useState } from "react";

const FORM_DEFAULT = { password: "" };
type FormTypes = typeof FORM_DEFAULT;

export default function Signin() {
  const wallet = useCrypto();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: FORM_DEFAULT,
  });

  const onSubmit = async (data: FormTypes) => {
    if (wallet.hasEncryptedSeed()) {
      const result = await wallet.restoreWallet(data.password);
      console.log("result", result);
      if (!result) {
        setError("Wallet can not be decrypted with the password.");
      }
    } else {
      setPassword(data.password);
    }
  };

  if (wallet.loaded) {
    return <Navigate to="/accounts" />;
  }

  if (password) {
    return <Words password={password} />;
  }

  const isSignIn = wallet.hasEncryptedSeed();

  const dictionary = isSignIn
    ? {
        heading: "Sign In",
        description: "Enter your password to decrypt your wallet.",
        button: "Decrypt wallet",
      }
    : {
        heading: "Create wallet",
        description: "Choose a password to encrypt your wallet.",
        button: "Create wallet",
      };

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">{dictionary.heading}</Heading>
        <Box marginRight="$2">{dictionary.description}</Box>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack direction="row" marginBottom="$md">
            <Input id="password" {...form.register("password")} outlined />
          </Stack>
          {error && (
            <Notification.Root
              color="negative"
              hasCloseButton
              icon="Close"
              onClose={() => setError("")}
              title="Error"
            >
              {error}
            </Notification.Root>
          )}
          <Stack direction="row" marginTop="$md" marginBottom="$md">
            <Button color={isSignIn ? "primary" : "positive"} type="submit">
              {dictionary.button}
            </Button>
          </Stack>
        </form>
      </Stack>
    </main>
  );
}
