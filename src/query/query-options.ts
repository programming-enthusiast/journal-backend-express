import { OrderBy } from './order-by';

export interface QueryOptions<T> {
  where?: Partial<T>;
  orderBy?: OrderBy;
}
