import type { GitInfo } from 'giget';
import Handlebars from 'handlebars';
import type { PactDependency, PactPrelude } from './types';

const inputRegex =
  /^(?<provider>[\w-.]+):(?<repo>[\w.-]+\/[\w.-]+)(?<subdir>[^#]+)?#?(?<ref>[\w./-]+)?/;
const providerShortcuts: Record<string, string> = {
  gh: 'github',
  gl: 'gitlab',
  bb: 'bitbucket',
  sh: 'sourcehut',
};

export function parseGitURI(input: string): GitInfo {
  const m = input.match(inputRegex)?.groups || {};
  const provider = m.provider || 'github';
  return {
    provider: (providerShortcuts[provider] || provider) as GitInfo['provider'],
    repo: m.repo,
    subdir: m.subdir || '/',
    ref: m.ref ?? 'main',
  };
}

export function getBaseRepo(uri: string) {
  const { provider, repo, ref } = parseGitURI(uri);
  return `${provider}:${repo}#${ref}`;
}

export function preludeSpec(
  name: string,
  uri: string,
  group: string = 'root',
  requires: PactDependency[] = [],
): PactDependency {
  return {
    name,
    uri,
    requires,
    group,
  };
}

export function renderTemplate(template: string, data: any) {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}
/**
 * Topologically sort an iterable of edges.
 *
 * @param edges - The iterable object of edges to sort.
 *   An edge is represented as a 2-tuple of `[fromNode, toNode]`.
 *
 * @returns The topologically sorted array of nodes.
 *
 * #### Notes
 * If a cycle is present in the graph, the cycle will be ignored and
 * the return value will be only approximately sorted.
 *
 * #### Example
 * ```typescript *
 * let data = [
 *   ['d', 'e'],
 *   ['c', 'd'],
 *   ['a', 'b'],
 *   ['b', 'c']
 * ];
 *
 * topologicSort(data);  // ['a', 'b', 'c', 'd', 'e']
 * ```
 */
export function topologicSort<T>(edges: Iterable<[T, T]>): T[] {
  // Setup the shared sorting state.
  const sorted: T[] = [];
  const visited = new Set<T>();
  const graph = new Map<T, T[]>();

  // Add the edges to the graph.
  for (const edge of edges) {
    addEdge(edge);
  }

  // Visit each node in the graph.
  for (const [k] of graph) {
    visit(k);
  }

  // Return the sorted results.
  return sorted;

  // Add an edge to the graph.
  function addEdge(edge: [T, T]): void {
    const [fromNode, toNode] = edge;
    const children = graph.get(toNode);
    if (children) {
      children.push(fromNode);
    } else {
      graph.set(toNode, [fromNode]);
    }
  }

  // Recursively visit the node.
  function visit(node: T): void {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    const children = graph.get(node);
    if (children) {
      for (const child of children) {
        visit(child);
      }
    }
    sorted.push(node);
  }
}

export function sortPreludesNames(preludes: PactPrelude[]) {
  // Convert to an array of edges
  const edges: [string, string][] = [];
  for (const prelude of preludes) {
    if (!prelude?.requires || prelude?.requires?.length === 0) {
      // Ensure that nodes without dependencies are also included
      edges.push([prelude.name, prelude.name]);
    } else {
      for (const requirement of prelude.requires) {
        edges.push([requirement, prelude.name]);
      }
    }
  }

  // Perform the topological sort
  return topologicSort(edges);
}

export function sortPreludes(preludes: PactPrelude[]) {
  const sortedNames = sortPreludesNames(preludes);
  const sortedPreludes: PactPrelude[] = [];
  for (const name of sortedNames) {
    const prelude = preludes.find((p) => p.name === name);
    if (prelude) {
      sortedPreludes.push(prelude);
    }
  }
  return sortedPreludes;
}
