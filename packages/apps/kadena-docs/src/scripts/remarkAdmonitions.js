const getHeaders = (tree) => {
  return tree.children.filter((branch) => {
    return branch.type === 'paragraph';
  });
};

const isStart = (branch) => {
  if (branch.children.length === 0) return false;
  return branch.children[0].value === ':::note';
};

let STARTELM;
const getStartElm = () => {
  return STARTELM;
};

const setStartElm = (startElm) => {
  STARTELM = startElm;
};

const clearStartElm = () => {
  STARTELM = undefined;
};

const reduceToNotifications = (acc, head) => {
  if (!head.children) return [...acc, head];

  if (isStart(head)) {
    setStartElm(head);
    return [...acc, head];
  }
  const startElm = getStartElm();
  if (getStartElm()) {
    startElm.type = 'element';
    startElm.data = {
      hName: 'kda-notification',
      hProperties: { 'data-cy': 'sdfaasf', className: ['testthis'] },
    };
    startElm.children[0].value = '';
    startElm.children = [...startElm.children, head];

    if (head.children[0].value === ':::') {
      head.children[0].value = '';
      clearStartElm();
    }

    // do not return the current head
    return acc;
  }

  return [...acc, head];
};

const remarkAdmonitions = () => {
  return async (tree) => {
    let startElm;
    const newChildren = tree.children.reduce(reduceToNotifications, []);

    tree.children = newChildren;
    return tree;
  };
};

export { remarkAdmonitions as default };
