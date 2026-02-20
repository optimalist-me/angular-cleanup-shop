import { CssTokenMap } from './token-types';

export const designCssVariablePrefix = '--ds-';

export function tokenVar(tokenName: string): string {
  return `var(${designCssVariablePrefix}${tokenName})`;
}

export function toCssVariables(
  tokens: CssTokenMap,
  prefix: string = designCssVariablePrefix,
): CssTokenMap {
  return Object.fromEntries(
    Object.entries(tokens).map(([tokenName, tokenValue]) => [
      `${prefix}${tokenName}`,
      tokenValue,
    ]),
  );
}

export function mergeTokenMaps(
  ...tokenMaps: ReadonlyArray<CssTokenMap>
): CssTokenMap {
  return Object.assign({}, ...tokenMaps);
}
