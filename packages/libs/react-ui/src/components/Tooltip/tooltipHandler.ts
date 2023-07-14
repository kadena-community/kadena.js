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

  const placement = node.getAttribute('data-placement');

  switch (placement) {
    case 'top':
      node.style.top = `${rect.top - node.offsetHeight + window.scrollY}px`;
      node.style.left = `${
        rect.left + rect.width / 2 - node.offsetWidth / 2 + window.scrollX
      }px`;
      break;
    case 'bottom':
      node.style.top = `${rect.top + rect.height + window.scrollY}px`;
      node.style.left = `${
        rect.left + rect.width / 2 - node.offsetWidth / 2 + window.scrollX
      }px`;
      break;
    case 'left':
      node.style.top = `${
        rect.top + rect.height / 2 - node.offsetHeight / 2 + window.scrollY
      }px`;
      node.style.left = `${rect.left - node.offsetWidth + window.scrollX}px`;
      break;
    case 'right':
      node.style.top = `${
        rect.top + rect.height / 2 - node.offsetHeight / 2 + window.scrollY
      }px`;
      node.style.left = `${rect.left + rect.width + window.scrollX}px`;
      break;
  }
}
