import { Order } from '..';

export interface QueryMethods<T> {
  where?: Partial<T>;
  orderBy?: [{ column: string; order: Order }];
}
