import { buildCommandFromTemplate } from '../buildCommandFromTemplate';

describe('buildCommandFromTemplate', () => {
  it('merges parts, holes and args correctly', () => {
    const parts = [`This is a template for `, `.`];
    const holes = ['name'];
    const args = { name: 'Albert' };
    const expected = 'This is a template for Albert.';
    const cmd = buildCommandFromTemplate(parts, holes, args);
    expect(cmd).toBe(expected);
  });
});
