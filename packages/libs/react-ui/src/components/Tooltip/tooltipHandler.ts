import { visibleClass } from './Tooltip.css';

import React from 'react';

export default function tooltipHandler(
  event: React.MouseEvent<HTMLElement>,
  ref: React.RefObject<HTMLDivElement>,
): void {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  const node = ref.current;
  if (!node) {
    throw new Error('Tooltip node is not defined');
  }
  node.classList.toggle(visibleClass);
  node.style.top = `${rect.top}px`;
  node.style.left = `${rect.left + rect.width}px`;
}
