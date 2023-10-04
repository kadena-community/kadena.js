import { getTypes } from './getTypes.mjs';
import { createSlug } from './createSlug.mjs';

// when we have a URL starting with '#',
// we need to recreate it, to send to the correct page
const recreateUrl = (pages, root) => (definition) => {
  if (!definition.url.startsWith('#')) return definition;

  const slug = definition.url.substring(1);

  definition.url = pages.reduce((acc, page, idx) => {
    const headingNode = findHeading(page, slug);

    if (headingNode) {
      const pageTitle = headingNode.children[0].value;
      const pageSlug = createSlug(pageTitle);

      let url = `${root}`;
      if (idx > 0) {
        url = `${url}/${pageSlug}`;
      }

      if (pageSlug !== slug) {
        url = `${url}#${slug}`;
      }

      // remove double slashes from internal url, if any
      if (!url.includes('http')) {
        url = url.replace(/\/\//g, '/');
      }

      return url;
    }

    return acc;
  }, definition.url);

  return definition;
};

const recreateUrls = (pages, root, definitions) =>
  definitions.map(recreateUrl(pages, root));

const relinkLinkReferences = (refs, definitions) => {
  refs.forEach((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);

    if (!definition) {
      throw new Error('no definition found');
    }

    ref.type = 'link';
    ref.url = definition.url;
    ref.children[0].value = `${ref.children[0].value} `; // the extra ' ' a hack. if the name is the same as the URL, MD will not render it correctly
    delete ref.label;
    delete ref.identifier;
    delete ref.referenceType;
  });
};

const relinkImageReferences = (refs, definitions) => {
  refs.map((ref) => {
    const definition = definitions.find((def) => def.label === ref.label);
    if (!definition) {
      throw new Error('no definition found');
    }

    ref.type = 'image';
    ref.url = definition.url;
    ref.alt = definition.alt;
    delete ref.label;
    delete ref.identifier;
    delete ref.referenceType;
  });
};

// find the correct title
// if the title is a h2 (start of the new page)
const findHeading = (tree, slug) => {
  const headings = getTypes(tree, 'heading');

  const heading = headings.find((heading) => {
    return createSlug(heading.children[0].value) === slug;
  });

  if (heading && heading.depth === 1) {
    return tree.children[0];
  }
  return;
};

// because we are creating new pages, we need to link the references to the correct pages
export const relinkReferences = (md, pages, root) => {
  const definitions = recreateUrls(pages, root, getTypes(md, 'definition'));

  const linkReferences = getTypes(md, 'linkReference');
  const imageReferences = getTypes(md, 'imageReference');

  relinkLinkReferences(linkReferences, definitions);
  relinkImageReferences(imageReferences, definitions);
};
