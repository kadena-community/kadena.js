import { IInputProps, Input as Field } from './Input/Input';
import { IInputWrapperProps, InputWrapper } from './InputWrapper/InputWrapper';

interface IInput {
  Wrapper: React.FC<IInputWrapperProps>;
  Field: React.FC<IInputProps>;
}

export { IInputProps, IInputWrapperProps };
export const Input: IInput = {
  Wrapper: InputWrapper,
  Field,
};

export { ITextFieldProps, TextField } from './TextField';
