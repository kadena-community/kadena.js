import { TreeList } from './TreeList';

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

describe('TreeList', () => {
  test('renders without title', () => {
    const { getByTestId } = render(<TreeList />);
    const treeListElement = getByTestId('kda-tree-list');
    expect(treeListElement).toBeInTheDocument();
  });

  test('renders with title', () => {
    const { getByTestId } = render(<TreeList title={'Example Title'} />);
    const treeTitleElement = getByTestId('kda-tree-title');
    expect(treeTitleElement).toBeInTheDocument();
  });

  test('expands/collapses on click', () => {
    const { getAllByTestId } = render(
      <TreeList title={'Example Title'} items={[{ title: 'Child Title' }]} />,
    );

    const treeTitleElement = getAllByTestId('kda-tree-title')[0];

    fireEvent.click(treeTitleElement);
    expect(treeTitleElement).toHaveClass('isOpen');
    fireEvent.click(treeTitleElement);
    expect(treeTitleElement).not.toHaveClass('isOpen');
  });

  test('renders child items when expanded', () => {
    const { getAllByTestId } = render(
      <TreeList
        title={'Example Title'}
        items={[
          { title: 'Child Title', items: [{ title: 'Grandchild Title' }] },
        ]}
      />,
    );
    const treeTitleElement = getAllByTestId('kda-tree-title')[0];
    fireEvent.click(treeTitleElement);
    const treeChildTitleElement = getAllByTestId('kda-tree-title')[1];
    expect(treeChildTitleElement).toBeInTheDocument();
  });
});
