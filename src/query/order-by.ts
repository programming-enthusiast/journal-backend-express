import { Ordering } from '../enums';

type OrderBy = { column: string; order: Ordering }[];

function toOrderBy(input: string): OrderBy {
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
}

export { OrderBy, toOrderBy };
