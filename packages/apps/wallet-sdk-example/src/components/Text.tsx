import { CopyToClipboard } from './Copy';

export const TextEllipsis = ({
  children,
  maxLength,
  placement,
  withCopyButton,
  withCopyClick,
}: {
  children: React.ReactNode;
  maxLength?: number;
  placement?: 'middle' | 'end';
  withCopyButton?: boolean;
  withCopyClick?: boolean;
}) => {
  if (typeof children !== 'string') return null;

  if (maxLength && children.length > maxLength) {
    if (placement === 'end') {
      return (
        <>
          <span
            title={children}
            className="flex items-center justify-end gap-1"
            onClick={() => {
              if (withCopyClick) navigator.clipboard.writeText(children);
            }}
          >
            {`${children.slice(0, maxLength - 3)}...`}{' '}
            {withCopyButton && <CopyToClipboard value={children} />}
          </span>
        </>
      );
    }

    const middle = Math.floor(maxLength / 2);
    return (
      <>
        <span
          title={children}
          className="flex items-center justify-end gap-1"
          onClick={() => {
            if (withCopyClick) navigator.clipboard.writeText(children);
          }}
        >
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
