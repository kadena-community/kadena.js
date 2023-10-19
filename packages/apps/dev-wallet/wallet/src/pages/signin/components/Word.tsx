import type { FC, ButtonHTMLAttributes } from "react";

export const Word: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button {...props} style={{ minWidth: 70, ...props.style }} />
);
