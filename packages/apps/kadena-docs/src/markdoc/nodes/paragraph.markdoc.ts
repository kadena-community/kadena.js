import { Paragraph } from '../../components/Markdoc';

import { Config, Schema } from '@markdoc/markdoc';

const heading: Schema<Config, typeof Paragraph> = {
  render: Paragraph,
  children: ['inline'],
  attributes: {
    level: { type: Number, required: true, default: 1 },
  },
};

export default heading;
