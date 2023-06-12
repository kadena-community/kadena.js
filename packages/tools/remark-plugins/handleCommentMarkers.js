import { commentMarker } from 'mdast-comment-marker';
import { zone } from 'mdast-zone';
import { visit } from 'unist-util-visit';

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('unified').Plugin<[], Root>} Plugin
 */

/**
 *
 * @param {Record<string, () => Root>} commentMarkers
 * @returns {(tree: Root) => void}
 */
export const handleCommentMarkers = (commentMarkers) => (tree) => {
  visit(tree, (node) => {
    const info = commentMarker(node);
    if (!info) return;
    if (!info.attributes.match(/start\b/i)) return;
    const name = info.name;
    if (typeof commentMarkers[name] !== 'function') return;

    const nodes = commentMarkers[name]();

    zone(tree, name, (start, _nodes, end) => [start, nodes, end]);
  });
};
