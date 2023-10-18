import { getTypes } from './utils.mjs';

const remarkFixAbsoluteLinks = () => {
  return async (tree) => {
    const links = getTypes(tree, 'link');
    const references = getTypes(tree, 'definition');

    var regExp = /^(https?:\/\/docs\.kadena\.io)/;

    [links, references].flat().forEach((link) => {
      if (link.url.match(regExp)) {
        const newLink = link.url.replace(regExp, '') || '/';

        link.url = newLink;
      }
    });

    return tree;
  };
};

export { remarkFixAbsoluteLinks as default };
