import type * as Stitches from '@stitches/react';
import { FC, MouseEventHandler } from 'react';
declare const StyledButton: any;
export interface IButtonProps {
    label?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    size?: Stitches.VariantProps<typeof StyledButton>['size'];
}
export declare const Button: FC<IButtonProps>;
export {};
