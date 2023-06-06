const NOTETYPES = ['info', 'note', 'tip', 'caution', 'danger', 'warning'];
const STARTNOTER_EGEXP = /^:::\s?([a-z]*)\s(.*)$/gi;

const isStart = (branch) => {
  if (branch.children.length === 0) return false;
  const value = branch.children[0].value ?? '';

  return value.match(STARTNOTER_EGEXP);
};

const getProps = (branch) => {
  if (branch.children.length === 0) return false;
  const value = branch.children[0].value ?? '';

  const match = STARTNOTER_EGEXP.exec(value);
  if (!match) return {};

  return {
    label: match[1],
    title: match[2],
  };
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

const reduceToNotifications = (acc, branch) => {
  if (!branch.children) return [...acc, branch];

  if (isStart(branch)) {
    setStartElm(branch);

    const props = getProps(branch);
    branch.type = 'element';
    branch.data = {
      hName: 'kda-notification',
      hProperties: props,
    };

    return [...acc, branch];
  }
  const startElm = getStartElm();
  if (startElm) {
    startElm.children[0].value = '';
    startElm.children = [...startElm.children, branch];

    if (branch.children[0].value === ':::') {
      branch.children[0].value = '';
      clearStartElm();
    }

    // do not return the current head
    return acc;
  }

  return [...acc, branch];
};

const remarkAdmonitions = () => {
  return async (tree) => {
    const newChildren = tree.children.reduce(reduceToNotifications, []);

    tree.children = newChildren;
    return tree;
  };
};

export { remarkAdmonitions as default };
