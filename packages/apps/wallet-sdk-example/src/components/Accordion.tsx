import { useEffect, useRef, useState } from 'react';

export interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (toggleFunction: () => void) => void;
}

export function AccordionSection({
  title,
  children,
  defaultOpen = false,
  onToggle,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [maxHeight, setMaxHeight] = useState('0');
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (onToggle) {
      onToggle(toggle);
    }
  }, [onToggle]);

  useEffect(() => {
    const contentElement = contentRef.current;

    const updateMaxHeight = () => {
      if (contentElement) {
        setMaxHeight(isOpen ? `${contentElement.scrollHeight + 50}px` : '0');
      }
    };

    updateMaxHeight();

    const observer = new ResizeObserver(updateMaxHeight);
    if (contentElement) {
      observer.observe(contentElement);
    }

    return () => {
      if (contentElement) {
        observer.unobserve(contentElement);
      }
    };
  }, [isOpen]);

  return (
    <div className={`${isOpen ? 'border-b border-border-gray' : ''}`}>
      <button
        onClick={toggle}
        style={{
          backgroundColor: 'var(--medium-slate)',
          color: 'var(--text-color)',
        }}
        className="w-full text-left p-4 font-bold flex justify-between items-center rounded-md"
      >
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: maxHeight,
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
        }}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
