import {
  MonoKeyboardArrowDown,
  MonoKeyboardArrowUp,
} from '@kadena/kode-icons/system';
import { Button, Popover, Stack, TextField } from '@kadena/kode-ui';
import { ReactNode, useEffect, useRef, useState } from 'react';

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
  onClose?: (value: string) => void;
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

  function closePopover(fromPopover = false) {
    setIsPopoverOpen(false);
    if (onClose && isPopoverOpen && !fromPopover) {
      console.log('calling onClose', text);
      onClose(text);
    }
  }

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

  return (
    <>
      <div ref={triggerRef} onClick={openPopover} style={{ flex: 1 }}>
        <TextField
          {...inputProps}
          ref={inputRef}
          value={text}
          defaultValue={defaultValue}
          onFocus={() => {
            if (!text) {
              openPopover();
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              if (livePopoverOpen.current) {
                closePopover();
              }
            }, 100);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && onSubmit) {
              onSubmit(text);
            }
          }}
          onChange={(event) => {
            const value = event.target.value;
            setText(value);
            if (value) {
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
                <Button
                  variant="transparent"
                  isCompact
                  onClick={() => closePopover()}
                >
                  <MonoKeyboardArrowUp />
                </Button>
              ) : (
                <Button
                  variant="transparent"
                  isCompact
                  onClick={() => openPopover()}
                >
                  <MonoKeyboardArrowDown />
                </Button>
              )}
            </Stack>
          }
        />
      </div>
      {
        <Popover
          state={{
            isOpen: Boolean(isPopoverOpen),
            close: (...args) => {
              console.log('close event called', args);
            },
            open: (...args) => {
              console.log('open', args);
            },
            toggle: (...args) => {
              console.log('toggle', args);
            },
            setOpen: (...args) => {
              console.log('setOpen', args);
            },
          }}
          shouldCloseOnInteractOutside={() => {
            return true;
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
      }
    </>
  );
}
