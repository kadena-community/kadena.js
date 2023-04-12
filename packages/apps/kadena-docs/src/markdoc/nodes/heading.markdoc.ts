import { TaggedHeading } from '../../components/Markdoc';

import {
  Config,
  MaybePromise,
  RenderableTreeNodes,
  Schema,
  Tag,
} from '@markdoc/markdoc';

const heading: Schema<Config, typeof TaggedHeading> = {
  render: TaggedHeading,
  children: ['inline'],
  attributes: {
    level: { type: Number, required: true, default: 1 },
  },
  transform(node, config): MaybePromise<RenderableTreeNodes> {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    return new Tag(
      // fix in the typing of MarkDoc.
      this.render as unknown as string,
      { as: `h${attributes.level}` },
      children,
    );
  },
};

export default heading;
