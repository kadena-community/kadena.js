import { MonoKAccount } from '@kadena/kode-icons/system';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';
import { Breadcrumbs, BreadcrumbsItem } from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  test('has the correct aria label and breadcrumbs', () => {
    const { getByLabelText, getByText } = render(
      <Breadcrumbs icon={<MonoKAccount />}>
        <BreadcrumbsItem>Item 1</BreadcrumbsItem>
        <BreadcrumbsItem>Item 2</BreadcrumbsItem>
      </Breadcrumbs>,
    );

    const nav = getByLabelText('Breadcrumbs');
    expect(nav).toBeInTheDocument();

    const item1 = getByText('Item 1');
    expect(item1).toBeInTheDocument();
  });

  test('disabled and current links are disabled', () => {
    const { getByText } = render(
      <Breadcrumbs>
        <BreadcrumbsItem isDisabled>Item 1</BreadcrumbsItem>
        <BreadcrumbsItem>Item 2</BreadcrumbsItem>
      </Breadcrumbs>,
    );

    const item1 = getByText('Item 1');
    expect(item1).toHaveAttribute('aria-disabled', 'true');
    expect(item1).toHaveAttribute('data-disabled', 'true');

    const item2 = getByText('Item 2');
    expect(item2).toHaveAttribute('aria-disabled', 'true');
    expect(item2).toHaveAttribute('data-current', 'true');
  });
});
