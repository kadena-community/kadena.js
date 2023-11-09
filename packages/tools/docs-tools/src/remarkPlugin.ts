
import { Node } from 'unist';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface Options {
  // Define any options you need for your plugin here
}

const remarkPlugin: Plugin<[Options?]> = (options = {}) => {

  interface Options {
    // Define any options you need for your plugin here
  }

  const remarkPlugin: Plugin<[Options?]> = (options = {}) => {
    return (tree: Node) => {
      visit(tree, 'link', (node: Node) => {
        const children = node.children[0];


      });
    };
  };
};

export default remarkPlugin;
