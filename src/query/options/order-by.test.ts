import { orderByRegex, toOrderBy } from './order-by';
import { Ordering } from '../../enums/ordering';

describe('order-by', () => {
  describe('orderByRegex', () => {
    test.each([
      'createdAt',
      'created_at',
      'created_at asc',
      'createdAt asc',
      'created_at desc',
      'createdAt desc',
      'created_at/title',
      'createdAt/title',
      'createdAt asc/title',
      'createdAt desc/title',
      'createdAt asc/title asc',
      'createdAt asc/title desc',
      'createdAt desc/title asc',
      'createdAt desc/title desc',
      'createdAt/title/text',
      'createdAt asc/title/text',
      'createdAt desc/title/text',
      'createdAt/title asc/text',
      'createdAt/title desc/text',
      'createdAt/title/text asc',
      'createdAt/title/text desc',
      'createdAt asc/title asc/text',
      'createdAt desc/title asc/text',
      'createdAt asc/title desc/text',
      'createdAt desc/title desc/text',
      'createdAt asc/title/text asc',
      'createdAt desc/title/text asc',
      'createdAt asc/title/text desc',
      'createdAt desc/title/text desc',
      'createdAt asc/title asc/text asc',
      'createdAt asc/title asc/text desc',
      'createdAt desc/title desc/text desc',
    ])('Given valid string %p then should test true', (str) => {
      expect(orderByRegex.test(str)).toBe(true);
    });

    test.each([
      'created_at invalid-ordering',
      'created_at asc/',
      'created_at/title/',
      'created_at asc/title/',
      'created_at desc/title/',
      'created_at/title asc/',
      'created_at/title desc/',
      'created_at asc/title asc/',
      'created_at desc/title desc/',
    ])('Given invalid string %p then should test false', (str) => {
      expect(orderByRegex.test(str)).toBe(false);
    });
  });

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
