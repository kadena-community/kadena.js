import yaml from 'js-yaml';
import { compareDesc } from 'date-fns';
import { getReadTime } from './utils.mjs';
import { getPathName } from './../utils/staticGeneration/checkSubTreeForActive.mjs';
import { getData } from './../utils/staticGeneration/getData.mjs';
import authors from './../data/authors.json' assert { type: 'json' };

const flat = (acc, val) => {
  const { children, ...newVal } = val;

  return [
    ...acc,
    newVal,
    children ? children.reduce(flat, []).flat() : undefined,
  ];
};

const getFlatData = () => {
  return getData().reduce(flat, []).flat();
};

const getCurrentPostFromJson = (root) => {
  const data = getFlatData();

  return data.find((item) => {
    return item && item.root === root;
  });
};

const getFrontMatter = (node) => {
  const { type, value } = node;

  if (type === 'yaml') {
    return yaml.load(value);
  }
};

const getLatestBlogPostsOfAuthor = (author) => {
  const data = getData();

  const STARTBRANCH = '/docs/blogchain';

  const startBranch = data.find((item) => item.root === STARTBRANCH);

  let posts =
    startBranch.children.flatMap((item) => {
      return item.children;
    }) ?? [];

  return posts
    .filter((post) => post.authorId === author.id)
    .sort((a, b) =>
      compareDesc(new Date(a.publishDate), new Date(b.publishDate)),
    )
    .slice(0, 5);
};

const getBlogAuthorInfo = (data) => {
  const authorId = data.authorId;
  if (!authorId) return;

  const author = authors.find((author) => author.id === authorId);
  if (!author) return;

  author.posts = getLatestBlogPostsOfAuthor(author);

  return author;
};

const getFileName = (file) => {
  if (file.history.length === 0) return '';
  return file.history[0];
};

const getFileNameInPackage = (file) => {
  const filename = getFileName(file);
  if (!filename) return '';
  const endPoint = 'packages';

  const dirArray = filename.split('/');

  const newPath = dirArray
    .reverse()
    .slice(0, dirArray.indexOf(endPoint) + 1)
    .reverse()
    .join('/');

  return `/${newPath}`;
};

/**
 * create a navigation object with the next and previous link in the navigation json.
 */
const createNavigation = (file) => {
  const path = getPathName(getFileName(file));
  const flatData = getFlatData();

  const itemIdx = flatData.findIndex((i) => {
    return i && i.root === path;
  });

  return {
    previous: flatData[itemIdx - 1] ?? undefined,
    next: flatData[itemIdx + 1] ?? undefined,
  };
};

const remarkFrontmatterToProps = () => {
  return async (tree, file) => {
    tree.children = tree.children.map((node) => {
      const frontMatterData = getFrontMatter(node);
      if (!frontMatterData) return node;
      const menuData =
        getCurrentPostFromJson(getPathName(getFileName(file))) ?? {};

      return {
        type: 'props',
        data: {
          frontmatter: {
            lastModifiedDate: menuData.lastModifiedDate,
            ...getReadTime(file.value),
            editLink:
              process.env.NEXT_PUBLIC_GIT_EDIT_ROOT +
              getFileNameInPackage(file),
            navigation: createNavigation(file),
            ...frontMatterData,
            authorInfo: getBlogAuthorInfo(frontMatterData),
          },
        },
      };
    });
  };
};

export { remarkFrontmatterToProps as default };
