const STARTNOTER_EGEXP = /^:::\s?(\w+)\s?([\w\s]+)?$/;
const ENDNOTER_EGEXP = /:::\s*$/m;
let STARTELM;

// check the branch with the start of a notification
// notifications start with ':::' followed by a label and maybe a title
const isStart = (branch) => {
  if (branch.children.length === 0) return false;
  const value = branch.children[0].value ?? '';

  return value.match(STARTNOTER_EGEXP);
};

const isEnd = (branch) => {
  if (branch.children.length === 0) return false;

  const endLeaf = branch.children.find((item) =>
    item.value?.match(ENDNOTER_EGEXP),
  );
  if (endLeaf) {
    endLeaf.value = endLeaf.value?.replace(':::', '');
    return Boolean(endLeaf);
  }
  return false;
};

// get the props (label and title) for the notification
const getProps = (branch) => {
  if (branch.children.length === 0) return {};
  const value = branch.children[0].value ?? '';

  const match = STARTNOTER_EGEXP.exec(value);
  if (!match) return {};

  return {
    label: match[1],
    title: match[2],
  };
};

const getStartElm = () => {
  return STARTELM;
};

const setStartElm = (startElm) => {
  STARTELM = startElm;
};

const clearStartElm = () => {
  STARTELM = undefined;
};

/**
 * the reduce function will make all the branches between the start and end of a notification a child of the start branch
 */
const reduceToNotifications = (acc, branch) => {
  if (!branch.children) return [...acc, branch];

  if (isStart(branch)) {
    setStartElm(branch);

    const props = getProps(branch);
    branch.type = 'element';
    branch.children[0].value = '';
    branch.data = {
      hName: 'kda-notification',
      hProperties: props,
    };

    if (isEnd(branch)) {
      clearStartElm();
    }

    return [...acc, branch];
  }

  const startElm = getStartElm();
  if (startElm) {
    if (isEnd(branch)) {
      clearStartElm();
    }
    startElm.children = [...startElm.children, branch];

    // if in the middle or end of the notification do not return the branch.
    // the branch is now a child of the startbranch
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
