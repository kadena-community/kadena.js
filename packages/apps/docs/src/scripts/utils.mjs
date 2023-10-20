export const getValues = (tree, arr = []) => {
  tree.children.forEach((branch) => {
    if (branch.value) arr.push(branch.value.trim());
    if (!branch.children) return arr;

    return getValues(branch, arr);
  });
  return arr;
};

export const getTypes = (tree, type, arr = []) => {
  tree.children.forEach((branch) => {
    if (branch.type === type) {
      arr.push(branch);
    }
    if (!branch.children) return arr;

    return getTypes(branch, type, arr);
  });
  return arr;
};
