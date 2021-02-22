import { toOrderBy } from '.';

describe('query-methods', () => {
  describe('toOrderBy', () => {
    test.each([
      ['', []],
      [' ', []],
      ['createdAt', [{ column: 'createdAt', order: 'asc' }]],
      ['createdAt asc', [{ column: 'createdAt', order: 'asc' }]],
      ['createdAt desc', [{ column: 'createdAt', order: 'desc' }]],
      [
        'createdAt desc/title/text asc',
        [
          { column: 'createdAt', order: 'desc' },
          { column: 'title', order: 'asc' },
          { column: 'text', order: 'asc' },
        ],
      ],
    ])(
      'Given %p then should return the expected OrderBy',
      (input, expected) => {
        expect(toOrderBy(input)).toEqual(expect.arrayContaining(expected));
      }
    );
  });
});
