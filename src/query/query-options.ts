import { OrderBy } from './order-by';

interface QueryOptions<T> {
  where?: Partial<T>;
  orderBy?: OrderBy;
}

export { QueryOptions };
