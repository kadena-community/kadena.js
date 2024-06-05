export const pushToParent = (
  parent: IParent[],
  child: IParent,
  rootIdx: number,
): IParent[] => {
  parent[rootIdx] = child;
  return parent;
};
