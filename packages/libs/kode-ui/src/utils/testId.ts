export interface ITestProps {
  'data-testid'?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const testProps = (props: ITestProps, postfix = '') =>
  typeof props['data-testid'] === 'string'
    ? {
        'data-testid': `${props['data-testid']}${postfix ? `-${postfix}` : ''}`,
      }
    : {};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const withTestProps = (props: ITestProps) => ({
  ...props,
  ...testProps(props),
});
