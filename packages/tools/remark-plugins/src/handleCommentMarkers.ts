import type { Content, Root } from 'mdast';
import { commentMarker } from 'mdast-comment-marker';
import { zone } from 'mdast-zone';
import { visit } from 'unist-util-visit';

type Node = Root | Content;
type CommentMarkers = Record<string, () => Node | undefined>;

export const handleCommentMarkers =
  (commentMarkers: CommentMarkers) => (tree: Root) => {
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
