import type { Content, Root } from 'mdast';
import { commentMarker } from 'mdast-comment-marker';
import { zone } from 'mdast-zone';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

type Node = Root | Content;
type CommentMarkers = Record<string, (vFile: VFile) => Node | undefined>;

export const handleCommentMarkers =
  (commentMarkers: CommentMarkers) => (tree: Root, vFile: VFile) => {
    visit(tree, (node) => {
      const info = commentMarker(node);
      if (!info) return;
      if (!info.attributes.match(/start\b/i)) return;
      const name = info.name;
      if (typeof commentMarkers[name] !== 'function') return;

      const nodes = commentMarkers[name](vFile);

      zone(tree, name, (start, _nodes, end) => [start, nodes, end]);
    });
  };
