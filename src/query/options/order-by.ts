import { Ordering } from '../../common/enums/ordering';

export type OrderBy = { column: string; order: Ordering }[];

export const orderByRegex = new RegExp(
  /^[a-zA-Z_]+(\s(asc|desc))?(\b\/[a-zA-Z_]+(\s(asc|desc))?)*$/
);

export const toOrderBy = (input: string): OrderBy => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return [];
  }

  const columnOrderPairs = trimmedInput.split('/').map((p) => p.split(' '));

  return columnOrderPairs.map((pair) => {
    return {
      column: pair[0],
      order: pair[1] in Ordering ? (pair[1] as Ordering) : Ordering.asc,
    };
  });
};
