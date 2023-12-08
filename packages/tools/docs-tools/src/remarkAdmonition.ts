import type { Paragraph, PhrasingContent } from 'mdast';
import type {
  ChildrenWithValues,
  DocsRootContent,
  ITree,
  Plugin,
  TypeWithValue,
} from './types';

const STARTNOTER_EGEXP: RegExp = /^:::\s?(\w+)\s?([\w\s]+)?$/;
const ENDNOTER_EGEXP: RegExp = /:::\s*$/m;

let STARTELM: Paragraph | undefined;

// check the branch with the start of a notification
// notifications start with ':::' followed by a label and maybe a title
// eslint-disable-next-line @rushstack/no-new-null
const isStart = (branch: DocsRootContent): null | RegExpMatchArray => {
  if ('children' in branch === false) return null;

  if ('children' in branch) {
    if (branch.children.length === 0) return null;
    const value = (branch.children as ChildrenWithValues)?.[0].value ?? '';
    return value.match(STARTNOTER_EGEXP);
  }
  return null;
};

const isEnd = (branch: DocsRootContent): boolean => {
  if ('children' in branch === false) return false;
  if ('children' in branch) {
    if (branch.children.length === 0) return false;

    const endLeaf = (branch.children as ChildrenWithValues).find(
      (item: TypeWithValue) => item.value?.match(ENDNOTER_EGEXP),
    );

    if (endLeaf) {
      endLeaf.value = endLeaf.value?.replace(':::', '');
      return Boolean(endLeaf);
    }
  }

  return false;
};

interface IReturnPropsType {
  label?: string;
  title?: string;
}

// get the props (label and title) for the notification
const getProps = (branch: DocsRootContent): IReturnPropsType | undefined => {
  if ('children' in branch === false) return {};

  if ('children' in branch) {
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

const getStartElm = (): Paragraph | undefined => {
  return STARTELM;
};

const setStartElm = (startElm: Paragraph): void => {
  STARTELM = startElm;
};

const clearStartElm = (): void => {
  STARTELM = undefined;
};

/**
 * the reduce function will make all the branches between the start and end of a notification a child of the start branch
 */
const reduceToNotifications = (
  acc: DocsRootContent[],
  branch: DocsRootContent,
): DocsRootContent[] => {
  if (branch.type === 'paragraph') {
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
    startElm.children = [...startElm.children, branch] as PhrasingContent[];

    // if in the middle or end of the notification do not return the branch.
    // the branch is now a child of the startbranch
    return acc;
  }

  return [...acc, branch];
};

const remarkAdmonitions = (): Plugin => {
  return async (tree): Promise<ITree> => {
    const newChildren = tree.children.reduce(reduceToNotifications, []);

    tree.children = newChildren;
    return tree;
  };
};

export { remarkAdmonitions as default };
