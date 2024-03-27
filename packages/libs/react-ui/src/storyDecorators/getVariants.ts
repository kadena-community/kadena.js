import type { RuntimeFn } from '@vanilla-extract/recipes';

export function getVariants<T extends {}>(recipe: RuntimeFn<T>) {
  const variants = recipe.variants();
  const classes = recipe.classNames.variants;

  return variants.reduce((result, variant) => {
    const variantValue = Object.keys(classes[variant]);

    return { ...result, [variant]: variantValue };
  }, {}) as { [P in keyof T]: string[] };
}
