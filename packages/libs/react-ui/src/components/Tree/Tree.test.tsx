import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { Tree } from './Tree';

describe('Tree', () => {
  test('renders without title', () => {
    const { getByTestId } = render(<Tree />);
    const treeElement = getByTestId('kda-tree-item');
    expect(treeElement).toBeInTheDocument();
  });

  test('renders with title', () => {
    const { getByTestId } = render(<Tree title={'Example Title'} />);
    const treeTitleElement = getByTestId('kda-tree-title');
    expect(treeTitleElement).toBeInTheDocument();
  });

  test('expands/collapses on click', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();

    const { getAllByTestId } = render(
      <Tree
        title={'Example Title'}
        items={[{ title: 'Child Title' }]}
        onOpen={onOpen}
        onClose={onClose}
      />,
    );

    const treeTitleElement = getAllByTestId('kda-tree-title')[0];

    expect(onOpen).toHaveBeenCalledTimes(0);
    fireEvent.click(treeTitleElement);
    expect(treeTitleElement).toHaveClass('isOpen');
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);

    fireEvent.click(treeTitleElement);
    expect(treeTitleElement).not.toHaveClass('isOpen');
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('expands/collapses on click while linked prop is true', () => {
    const onOpenFirst = vi.fn();
    const onCloseFirst = vi.fn();
    const onOpenSecond = vi.fn();
    const onCloseSecond = vi.fn();

    const { getAllByTestId } = render(
      <Tree
        title={'Example Title'}
        isOpen={true}
        linked={true}
        items={[
          {
            title: 'First Child Title',
            onOpen: onOpenFirst,
            onClose: onCloseFirst,
            items: [{ title: 'Grand child' }],
          },
          {
            title: 'Second Child Title',
            onOpen: onOpenSecond,
            onClose: onCloseSecond,
            items: [{ title: 'Grand child' }],
          },
        ]}
      />,
    );

    const treeTitleElement = getAllByTestId('kda-tree-title')[0];
    expect(treeTitleElement).toHaveClass('isOpen');

    const firstTitle = getAllByTestId('kda-tree-title')[1];
    const secondTitle = getAllByTestId('kda-tree-title')[2];

    expect(firstTitle).toBeInTheDocument();
    expect(secondTitle).toBeInTheDocument();
    expect(onOpenFirst).toHaveBeenCalledTimes(0);
    expect(onCloseFirst).toHaveBeenCalledTimes(0);
    expect(onOpenSecond).toHaveBeenCalledTimes(0);
    expect(onCloseSecond).toHaveBeenCalledTimes(0);

    fireEvent.click(firstTitle);
    expect(onOpenFirst).toHaveBeenCalledTimes(1);

    fireEvent.click(secondTitle);
    expect(onCloseFirst).toHaveBeenCalledTimes(1);
    expect(onOpenSecond).toHaveBeenCalledTimes(1);

    fireEvent.click(secondTitle);
    expect(onCloseSecond).toHaveBeenCalledTimes(1);
  });

  test('renders child items when expanded, and callbacks should not get called when there is no grand child', () => {
    const onChildOpen = vi.fn();
    const onChildClose = vi.fn();

    const { getAllByTestId } = render(
      <Tree
        title={'Example Title'}
        items={[
          {
            title: 'Child Title',
            onOpen: onChildOpen,
            onClose: onChildClose,
          },
        ]}
      />,
    );
    const treeTitleElement = getAllByTestId('kda-tree-title')[0];
    fireEvent.click(treeTitleElement);

    const treeChildTitleElement = getAllByTestId('kda-tree-title')[1];
    expect(treeChildTitleElement).toBeInTheDocument();

    expect(onChildOpen).toHaveBeenCalledTimes(0);
    expect(onChildClose).toHaveBeenCalledTimes(0);
    fireEvent.click(treeChildTitleElement);
    expect(onChildOpen).toHaveBeenCalledTimes(0);
    expect(onChildClose).toHaveBeenCalledTimes(0);
  });

  test('renders child items when expanded, and callbacks should get called when there is grand child', () => {
    const onChildOpen = vi.fn();
    const onChildClose = vi.fn();

    const { getAllByTestId } = render(
      <Tree
        title={'Example Title'}
        items={[
          {
            title: 'Child Title',
            onOpen: onChildOpen,
            onClose: onChildClose,
            items: [{ title: 'grand child' }],
          },
        ]}
      />,
    );
    const treeTitleElement = getAllByTestId('kda-tree-title')[0];
    fireEvent.click(treeTitleElement);

    const treeChildTitleElement = getAllByTestId('kda-tree-title')[1];
    expect(treeChildTitleElement).toBeInTheDocument();

    expect(onChildOpen).toHaveBeenCalledTimes(0);
    expect(onChildClose).toHaveBeenCalledTimes(0);

    fireEvent.click(treeChildTitleElement);
    expect(onChildOpen).toHaveBeenCalledTimes(1);

    fireEvent.click(treeChildTitleElement);
    expect(onChildClose).toHaveBeenCalledTimes(1);
  });
});
