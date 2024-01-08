// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function disableLoadingProps<T>(props: T): T {
  const newProps: any = { ...props };
  // Don't allow interaction while isPending is true
  if (newProps.isLoading) {
    newProps.onPress = undefined;
    newProps.onPressStart = undefined;
    newProps.onPressEnd = undefined;
    newProps.onPressChange = undefined;
    newProps.onPressUp = undefined;
    newProps.onKeyDown = undefined;
    newProps.onKeyUp = undefined;
    newProps.onClick = undefined;
  }
  return newProps;
}
