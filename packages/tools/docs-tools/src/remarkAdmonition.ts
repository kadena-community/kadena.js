import { Paragraph, PhrasingContent } from "mdast";
import { DocsRootContent, ITree, Plugin, ChildrenWithValues, typeWithValue } from "./types";

const STARTNOTER_EGEXP = /^:::\s?(\w+)\s?([\w\s]+)?$/;
const ENDNOTER_EGEXP = /:::\s*$/m;

let STARTELM: Paragraph | undefined;

// check the branch with the start of a notification
// notifications start with ':::' followed by a label and maybe a title
const isStart = (branch: DocsRootContent): null | string[] => {
  if('children' in branch === false) return null;

  if ('children' in branch) {
    if(branch.children.length === 0) return null;
    const value = (branch.children as ChildrenWithValues)?.[0].value ?? '';
    console.log('isStart ', value.match(STARTNOTER_EGEXP));
    return value.match(STARTNOTER_EGEXP);
  }
  return null;
};

const isEnd = (branch: DocsRootContent): boolean => {
  if('children' in branch === false) return false;
  if('children' in branch) {
    if (branch.children.length === 0) return false;

    const endLeaf = (branch.children as ChildrenWithValues).find((item: typeWithValue) =>
      item.value?.match(ENDNOTER_EGEXP),
    );

    if (endLeaf) {
      endLeaf.value = endLeaf.value?.replace(':::', '');
      return Boolean(endLeaf);
    }
  }

  return false;
};

// get the props (label and title) for the notification
const getProps = (branch: DocsRootContent) => {
  if('children' in branch === false) return {};

  if('children' in branch) {
    if (branch.children.length === 0) return {};
    const value = (branch.children as ChildrenWithValues)[0].value ?? '';

    const match = STARTNOTER_EGEXP.exec(value);
    if (!match) return {};

    return {
      label: match[1],
      title: match[2],
    };
  }
};

const getStartElm = () => {
  return STARTELM;
};

const setStartElm = (startElm: Paragraph) => {
  STARTELM = startElm;
};

const clearStartElm = () => {
  STARTELM = undefined;
};

/**
 * the reduce function will make all the branches between the start and end of a notification a child of the start branch
 */
const reduceToNotifications = (acc: DocsRootContent[], branch:DocsRootContent) => {
  if(branch.type === 'paragraph') {
    if (isStart(branch)) {
      setStartElm(branch);

      const props = getProps(branch);
      // @ts-ignore
      branch.type = 'element';
      (branch.children as ChildrenWithValues)[0].value = '';
      branch.data = {
        hName: 'kda-notification',
        hProperties: props,
      };

      if (isEnd(branch)) {
        clearStartElm();
      }

      return [...acc, branch];
    }
  } else {
    return [...acc, branch];
  }


  const startElm = getStartElm();
  if (startElm) {
    if (isEnd(branch)) {
      clearStartElm();
    }
    console.log('startElm ', startElm);
    startElm.children = [
      ...startElm.children,
      branch,
    ] as PhrasingContent[];

    // if in the middle or end of the notification do not return the branch.
    // the branch is now a child of the startbranch
    return acc;
  }

  return [...acc, branch];
};

const remarkAdmonitions = (): Plugin => {
  return async (tree): Promise<ITree> => {
    const newChildren = tree.children
    .reduce(reduceToNotifications, []);

    tree.children = newChildren;
    return tree;
  };
};

export { remarkAdmonitions as default };
