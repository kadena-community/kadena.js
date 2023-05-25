const getHeaders = (tree) => {
  return tree.children.filter((branch) => {
    return branch.type === 'paragraph';
  });
};

const isStart = (branch) => {
  if (head.children.length === 0) return false;

  return head.children[0].value === ':::note';
};

const remarkAdmonitions = () => {
  return async (tree) => {
    let startElm;
    const newChildren = tree.children.reduce((acc, head) => {
      if (!head.children) return [...acc, head];

      if (head.children[0].value === ':::note') {
        startElm = head;
        return [...acc, head];
      }

      if (startElm) {
        startElm.type = 'element';
        startElm.data = {
          hName: 'kda-notification',
          hProperties: { 'data-cy': 'sdfsf', className: ['testthis'] },
        };
        startElm.children[0].value = '';
        startElm.children = [...startElm.children, head];

        if (head.children[0].value === ':::') {
          head.children[0].value = '';
          console.log(head.children);
          startElm = undefined;
        }

        return acc;
      }
      // } else {
      return [...acc, head];
      //}
    }, []);

    tree.children = newChildren;
    return tree;
  };
};

export { remarkAdmonitions as default };
