import { TextField } from '@kadena/kode-ui';
export const TokenInput = () => {
  return (
    <>
      <TextField
        description="Helper text"
        errorMessage=""
        fontType="ui"
        info="Additional information"
        label="Label"
        onValueChange={() => {}}
        placeholder="This is a placeholder"
        size="md"
        tag="tag"
        value=""
        variant="default"
      />
    </>
  );
};
