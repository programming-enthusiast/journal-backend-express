import { OrderBy } from './options/order-by';

export interface QueryOptions<T> {
  where?: Partial<T>;
  orderBy?: OrderBy;
}
