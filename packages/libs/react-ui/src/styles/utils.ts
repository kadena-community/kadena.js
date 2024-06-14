import type { GlobalStyleRule, StyleRule } from '@vanilla-extract/css';
import {
  globalStyle as vanillaGlobalStyle,
  style as vanillaStyle,
  styleVariants as vanillaStyleVariants,
} from '@vanilla-extract/css';
import { recipe as vanillaRecipe } from '@vanilla-extract/recipes';
import { defaults } from './layers.css';

type ClassNames = string | Array<ClassNames>;
type ComplexStyleRule = StyleRule | Array<StyleRule | ClassNames>;

type RecipeStyleRule = ComplexStyleRule | string;
type VariantDefinitions = Record<string, RecipeStyleRule>;
type VariantGroups = Record<string, VariantDefinitions>;
type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;
type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};
interface CompoundVariant<Variants extends VariantGroups> {
  variants: VariantSelection<Variants>;
  style: RecipeStyleRule;
}

type PatternOptions<Variants extends VariantGroups> = {
  base?: RecipeStyleRule;
  variants?: Variants;
  defaultVariants?: VariantSelection<Variants>;
  compoundVariants?: Array<CompoundVariant<Variants>>;
};

const addLayer = (styles: StyleRule) => {
  return {
    '@layer': {
      [defaults]: styles,
    },
  };
};

const addLayers = (styles: (StyleRule | ClassNames)[]): ComplexStyleRule =>
  styles.map((rule) => {
    return typeof rule === 'string' ? rule : addLayer(rule as StyleRule);
  });

export const layerStyles = (
  styles: ComplexStyleRule | RecipeStyleRule | GlobalStyleRule,
) => {
  let newStyles = styles;

  if (Array.isArray(styles)) {
    return addLayers(styles);
  }

  if (typeof styles === 'string') {
    return styles;
  }

  newStyles = addLayer(styles);

  return newStyles;
};

export function traverseRecipe<Variants extends VariantGroups>(
  styles: PatternOptions<Variants>,
) {
  return Object.entries(styles).reduce((result, [key, value]) => {
    if (key === 'base' && styles.base) {
      return { ...result, base: layerStyles(value as RecipeStyleRule) };
    }

    if (key === 'variants' && styles.variants) {
      return {
        ...result,
        variants: Object.entries(styles.variants).reduce(
          (acc, [variantKey, variantValue]) => {
            if (!styles.variants) return acc;

            return {
              ...acc,
              [variantKey]: Object.entries(variantValue).reduce(
                (variantStyles, [variationKey, variationStyle]) => {
                  return {
                    ...variantStyles,
                    [variationKey]: layerStyles(
                      variationStyle as ComplexStyleRule,
                    ),
                  };
                },
                {},
              ),
            };
          },
          {},
        ),
      };
    }

    if (key === 'compoundVariants' && styles.compoundVariants) {
      return {
        ...result,
        compoundVariants: styles.compoundVariants.map((compound) => {
          return {
            variants: compound.variants,
            style: layerStyles(compound.style),
          };
        }),
      };
    }

    if (key === 'defaultVariants' && styles.defaultVariants) {
      return { ...result, defaultVariants: styles.defaultVariants };
    }

    return result;
  }, {});
}

export const mapStyleVariants = (
  styles: Record<string | number, ComplexStyleRule>,
) => {
  return Object.entries(styles).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: layerStyles(value),
    };
  }, {});
};

export const style = (styles: ComplexStyleRule, debugId?: string) =>
  vanillaStyle(layerStyles(styles) as ComplexStyleRule, debugId);

export function styleVariants<
  StyleMap extends Record<string | number, ComplexStyleRule>,
>(styleMap: StyleMap, debugId?: string): Record<keyof StyleMap, string>;

export function styleVariants<
  Data extends Record<string | number, unknown>,
  Key extends keyof Data,
>(
  data: Data,
  mapData: (value: Data[Key], key: Key) => ComplexStyleRule,
  debugId?: string,
): Record<keyof Data, string>;

export function styleVariants(styles: any, debugId?: any) {
  return vanillaStyleVariants(mapStyleVariants(styles), debugId);
}

export function recipe<Variants extends VariantGroups>(
  styles: PatternOptions<Variants>,
  debugId?: string,
) {
  return vanillaRecipe(traverseRecipe(styles), debugId);
}

export const globalStyle = (selector: string, styles: GlobalStyleRule) => {
  return vanillaGlobalStyle(selector, layerStyles(styles) as GlobalStyleRule);
};
