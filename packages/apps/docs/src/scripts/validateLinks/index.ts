import type { IScriptResult } from './../types';
import type { IValidateAnchorLinksResult } from './validateMarkdownHashLinks';
import validateMarkdownHashLinks from './validateMarkdownHashLinks';
import type { IValidateMarkdownLinksResult } from './validateMarkdownLinks';
import validateMarkdownLinks from './validateMarkdownLinks';
import type { IValidateTypeScriptFileLinksResult } from './validateTypeScriptFileLinks';
import validateTypeScriptFileLinks from './validateTypeScriptFileLinks';

//const args = process.argv.slice(2);
//const isCi = args.includes('--ci');

const errors: string[] = [];
const success: string[] = [];

// This is to avoid false positives for links that are not broken within the docs
// but are broken in the website E.g. might comes from the different docs repo
// it could be fixed in the following PR later on
// to avoid the hard dependency on the doc website repo

// since we already have the redirect in place for the /learn-pact/beginner/welcome-to-pact it's ignored
const ignoreLinks: string[] = [];

const canIgnoreLink = (link: string): boolean => {
  const cleanLink = link.split('#')[0];
  return !ignoreLinks.includes(cleanLink);
};

export const validateLinks = async (): Promise<IScriptResult> => {
  const basePath: string = './src/pages';
  const [markdownLinks, typeScriptLinks, markdownHashLinks] =
    (await Promise.all([
      validateMarkdownLinks(basePath),
      validateTypeScriptFileLinks(basePath),
      validateMarkdownHashLinks(basePath),
    ]).catch((error) => {
      console.error(error);
    })) as [
      IValidateMarkdownLinksResult[],
      IValidateTypeScriptFileLinksResult[],
      IValidateAnchorLinksResult[],
    ];

  if (markdownLinks.length > 0) {
    markdownLinks.forEach((result) => {
      result.brokenLinks.forEach((link) => {
        if (!canIgnoreLink(link)) return;
        errors.push(`File: ${result.file} - ${link}`);
      });
    });
  } else {
    success.push('No broken Markdown links found.');
  }

  if (typeScriptLinks.length > 0) {
    typeScriptLinks.forEach((result) => {
      result.brokenLinks.forEach((link) => {
        if (!canIgnoreLink(link)) return;
        errors.push(`File: ${result.file} - ${link}`);
      });
    });
  } else {
    success.push('No broken TypeScript links found.');
  }

  if (markdownHashLinks.length > 0) {
    markdownHashLinks.forEach((result) => {
      if (result.invalidAnchors.length > 0) {
        result.invalidAnchors.forEach((link) => {
          if (!canIgnoreLink(link)) return;
          errors.push(`File: ${result.file} - ${link}`);
        });
      }
      if (result.invalidInternalAnchors.length > 0) {
        result.invalidInternalAnchors.forEach((link) => {
          if (!canIgnoreLink(link)) return;
          errors.push(`File: ${result.file} - ${link}`);
        });
      }
    });
  } else {
    success.push('No broken Markdown hash links found.');
  }

  return { errors, success };
};
