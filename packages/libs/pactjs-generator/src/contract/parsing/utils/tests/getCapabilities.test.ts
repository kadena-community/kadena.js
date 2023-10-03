import type { IModule } from '../../pactParser';
import { getCapabilities } from '../getCapabilities';

describe('getCapabilities', () => {
  it('returns list of capabilities that come with-capability', () => {
    const modules = new Map<string, IModule>();
    modules.set('test_namespace.test_module', {
      kind: 'module',
      namespace: 'test_namespace',
      name: 'test_module',
      doc: 'test module',
      governance: 'GOVERNANCE',
      functions: [
        {
          kind: 'defun',
          name: 'test-function',
          withCapabilities: ['test-capability'],
        },
      ],
      capabilities: [
        {
          kind: 'defcap',
          name: 'test-capability',
          doc: 'this is a test capability',
        },
      ],
    });
    const capabilities = getCapabilities(
      modules,
      'test_namespace.test_module',
      'test-function',
    );

    expect(capabilities).toEqual([
      {
        name: 'test-capability',
        fullModuleName: 'test_namespace.test_module',
        reason: 'with-capability',
        origin: 'test-function',
        capability: {
          kind: 'defcap',
          name: 'test-capability',
          doc: 'this is a test capability',
        },
      },
    ]);
  });

  it('returns list of capabilities including compose-capability', () => {
    const modules = new Map<string, IModule>();
    modules.set('test_namespace.test_module', {
      kind: 'module',
      namespace: 'test_namespace',
      name: 'test_module',
      doc: 'test module',
      governance: 'GOVERNANCE',
      functions: [
        {
          kind: 'defun',
          name: 'test-function',
          withCapabilities: ['first-capability'],
        },
      ],
      capabilities: [
        {
          kind: 'defcap',
          name: 'first-capability',
          doc: 'this is the first capability',
          composeCapabilities: ['second-capability'],
        },
        {
          kind: 'defcap',
          name: 'second-capability',
          doc: 'this is the second capability',
        },
      ],
    });
    const capabilities = getCapabilities(
      modules,
      'test_namespace.test_module',
      'test-function',
    );

    expect(capabilities).toEqual([
      {
        name: 'first-capability',
        fullModuleName: 'test_namespace.test_module',
        reason: 'with-capability',
        origin: 'test-function',
        capability: {
          kind: 'defcap',
          name: 'first-capability',
          doc: 'this is the first capability',
          composeCapabilities: ['second-capability'],
        },
      },
      {
        name: 'second-capability',
        fullModuleName: 'test_namespace.test_module',
        reason: 'compose-capability',
        origin: 'first-capability',
        capability: {
          kind: 'defcap',
          name: 'second-capability',
          doc: 'this is the second capability',
        },
      },
    ]);
  });
});
