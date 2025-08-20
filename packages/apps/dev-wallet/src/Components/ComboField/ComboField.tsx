import {
  MonoKeyboardArrowDown,
  MonoKeyboardArrowUp,
} from '@kadena/kode-icons/system';
import { Button, Popover, Stack, TextField } from '@kadena/kode-ui';
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const refGuard = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): ref is React.RefObject<T> & { current: T } => {
  return !!ref.current;
};

export function ComboField({
  children,
  value,
  onChange,
  defaultValue,
  clear,
  onClose,
  onOpen,
  onSubmit,
  ...inputProps
}: React.ComponentProps<typeof TextField> & {
  children: (props: { value: string; close: () => void }) => ReactNode;
  clear?: ReactNode;
  onClose?: () => void;
  onOpen?: (value: string) => void;
  onSubmit?: (value: string) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const livePopoverOpen = useRef(isPopoverOpen);
  livePopoverOpen.current = isPopoverOpen;
  const [text, setText] = useState(value ?? defaultValue ?? '');
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const closePopover = useCallback(
    (fromPopover = false) => {
      setIsPopoverOpen(false);
      if (onClose && isPopoverOpen && !fromPopover) {
        console.log('calling onClose');
        onClose();
      }
    },
    [isPopoverOpen, onClose],
  );

  function openPopover() {
    setIsPopoverOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onOpen && !isPopoverOpen) {
      onOpen(text);
    }
  }

  useEffect(() => {
    if (value !== undefined && value !== text) {
      setText(value);
    }
  }, [value, text]);

  const content = children({
    value: text,
    close: () => {
      closePopover(true);
    },
  });

  useLayoutEffect(() => {
    if (isPopoverOpen) {
      const listener = (event: Event) => {
        console.log('event', event);
        if (
          !popoverRef.current?.contains(event.target as Node) &&
          !triggerRef.current?.contains(event.target as Node)
        ) {
          closePopover();
        }
      };
      const events = ['click', 'focusin', 'scroll'];
      events.forEach((event) => {
        window.addEventListener(event, listener);
      });

      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, listener);
        });
      };
    }
  }, [closePopover, isPopoverOpen]);

  return (
    <>
      <div ref={triggerRef} onClick={openPopover} style={{ flex: 1 }}>
        <TextField
          {...inputProps}
          ref={inputRef}
          value={text}
          defaultValue={defaultValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && onSubmit) {
              onSubmit(text);
            }
          }}
          onChange={(event) => {
            const value = event.target.value;
            setText(value);
            if (!isPopoverOpen) {
              openPopover();
            }
            if (onChange) {
              onChange(event);
            }
          }}
          endAddon={
            <Stack>
              {clear}
              {isPopoverOpen ? (
                <Button variant="transparent" onClick={() => closePopover()}>
                  <MonoKeyboardArrowUp />
                </Button>
              ) : (
                <Button variant="transparent" onClick={() => openPopover()}>
                  <MonoKeyboardArrowDown />
                </Button>
              )}
            </Stack>
          }
        />
      </div>
      {refGuard(triggerRef) && (
        <Popover
          state={{
            isOpen: Boolean(isPopoverOpen),
            close: () => {},
            open: () => {},
            toggle: () => {},
            setOpen: () => {},
          }}
          offset={0}
          triggerRef={triggerRef}
          ref={popoverRef}
          isNonModal
          showArrow={false}
          placement="bottom start"
        >
          {content}
        </Popover>
      )}
    </>
  );
}
