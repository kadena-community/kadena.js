import { CopyToClipboard } from './Copy';

export const TextEllipsis = ({
  children,
  maxLength,
  placement,
  withCopyButton,
}: {
  children: React.ReactNode;
  maxLength?: number;
  placement?: 'middle' | 'end';
  withCopyButton?: boolean;
}) => {
  if (typeof children !== 'string') return null;

  if (maxLength && children.length > maxLength) {
    if (placement === 'end') {
      return (
        <>
          <span title={children} className="flex justify-center gap-1">
            {`${children.slice(0, maxLength - 3)}...`}{' '}
            {withCopyButton && <CopyToClipboard value={children} />}
          </span>
        </>
      );
    }

    const middle = Math.floor(maxLength / 2);
    return (
      <>
        <span title={children} className="flex justify-center gap-1">
          {children.slice(0, middle)}
          ...
          {children.slice(children.length - maxLength + middle)}
          {withCopyButton && <CopyToClipboard value={children} />}
        </span>
      </>
    );
  }

  return <p className="text-text-secondary">{children}</p>;
};
