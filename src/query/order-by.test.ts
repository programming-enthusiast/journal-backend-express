import { Ordering } from '../enums';
import { toOrderBy } from './order-by';

describe('order-by', () => {
  describe('toOrderBy', () => {
    test.each([
      ['', []],
      [' ', []],
      ['createdAt', [{ column: 'createdAt', order: Ordering.asc }]],
      ['createdAt asc', [{ column: 'createdAt', order: Ordering.asc }]],
      ['createdAt desc', [{ column: 'createdAt', order: Ordering.desc }]],
      [
        'createdAt/title/text',
        [
          { column: 'createdAt', order: Ordering.asc },
          { column: 'title', order: Ordering.asc },
          { column: 'text', order: Ordering.asc },
        ],
      ],
      [
        'createdAt desc/title desc/text desc',
        [
          { column: 'createdAt', order: Ordering.desc },
          { column: 'title', order: Ordering.desc },
          { column: 'text', order: Ordering.desc },
        ],
      ],
      [
        'createdAt asc/title desc/text',
        [
          { column: 'createdAt', order: Ordering.asc },
          { column: 'title', order: Ordering.desc },
          { column: 'text', order: Ordering.asc },
        ],
      ],
    ])('Given valid orderBy %p then should return %p', (input, expected) => {
      expect(toOrderBy(input)).toEqual(expect.arrayContaining(expected));
    });
  });
});
