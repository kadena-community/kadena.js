import classNames from 'classnames';
import { buttonListClass } from './style.css';

export function ButtonItem({
  children,
  selected = false,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { selected?: boolean }) {
  return (
    <button
      {...props}
      className={classNames(buttonListClass, selected && 'selected')}
    >
      {children}
    </button>
  );
}
