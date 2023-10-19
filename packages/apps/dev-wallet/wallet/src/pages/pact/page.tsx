import { Box, ContentHeader, Heading, Stack } from "@kadena/react-ui";
import { useState } from "react";
import { PreviewForm, PreviewFormValues } from "./PreviewForm";
import { SubmitForm } from "./SubmitForm";

export default function Upload() {
  const [cancelled, setCancelled] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<PreviewFormValues | null>(
    null
  );

  const onSubmitPreview = (values: PreviewFormValues) => {
    setPreviewData(values);
    setCancelled(false);
  };

  return (
    <main>
      <Stack direction="column" gap="$md" margin="$md">
        <Heading as="h3">Execute pact</Heading>
        <Stack direction="row" margin="$md" justifyContent="space-between">
          <Box margin="$md">
            <ContentHeader
              heading="Execute pact"
              icon="KeyIconFilled"
              description="Upload a pact module or run pact code on the chain."
            />
          </Box>
        </Stack>
        {previewData && !cancelled ? (
          <SubmitForm
            values={previewData}
            onCancel={() => setCancelled(true)}
          />
        ) : (
          <PreviewForm onSubmit={onSubmitPreview} defaults={previewData} />
        )}
      </Stack>
    </main>
  );
}
