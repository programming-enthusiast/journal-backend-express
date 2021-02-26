import { Ordering, Orderings } from '../types/ordering';

type OrderBy = { column: string; order: Ordering }[];

export interface QueryMethods<T> {
  where?: Partial<T>;
  orderBy?: OrderBy;
}

export const toOrderBy = (input: string): OrderBy => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return [];
  }

  const columnOrderPairs = trimmedInput.split('/').map((p) => p.split(' '));

  return columnOrderPairs.map((pair) => {
    return {
      column: pair[0],
      order: pair[1] in Orderings ? (pair[1] as Ordering) : Orderings.asc,
    };
  });
};
