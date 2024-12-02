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
  ...inputProps
}: React.ComponentProps<typeof TextField> & {
  children: (props: { value: string; close: () => void }) => ReactNode;
  clear?: ReactNode;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [text, setText] = useState(value ?? defaultValue ?? '');
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== text) {
      setText(value);
    }
  }, [value, text]);

  const content = children({
    value: text,
    close: () => setIsPopoverOpen(false),
  });

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => {
          setIsPopoverOpen(true);
        }}
      >
        <TextField
          {...inputProps}
          value={text}
          defaultValue={defaultValue}
          onFocus={() => {
            if (!text) {
              setIsPopoverOpen(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsPopoverOpen(false);
            }, 100);
          }}
          onChange={(event) => {
            const value = event.target.value;
            setText(value);
            if (value) {
              setIsPopoverOpen(true);
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
                  onClick={() => setIsPopoverOpen(false)}
                >
                  <MonoKeyboardArrowUp />
                </Button>
              ) : (
                <Button
                  variant="transparent"
                  isCompact
                  onClick={() => setIsPopoverOpen(true)}
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
            isOpen: Boolean(isPopoverOpen && content),
            close: (...args) => {
              setIsPopoverOpen(false);
              console.log('close', args);
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
          // offset={5}
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
