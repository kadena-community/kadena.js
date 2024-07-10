export interface ITestProps {
  'data-testid'?: string;
}

export const testProps = (props: ITestProps, postfix = '') =>
  typeof props['data-testid'] === 'string'
    ? {
        'data-testid': `${props['data-testid']}${postfix ? `-${postfix}` : ''}`,
      }
    : {};

export const withTestProps = (props: ITestProps) => ({
  ...props,
  ...testProps(props),
});
