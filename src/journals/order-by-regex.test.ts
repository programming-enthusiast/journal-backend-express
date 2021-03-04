import { entriesOrderByRegex } from './order-by-regex';

describe('orderByRegex', () => {
  test.each([
    'created_at',
    'created_at',
    'created_at asc',
    'created_at asc',
    'created_at desc',
    'created_at desc',
    'created_at/title',
    'created_at/title',
    'created_at asc/title',
    'created_at desc/title',
    'created_at asc/title asc',
    'created_at asc/title desc',
    'created_at desc/title asc',
    'created_at desc/title desc',
    'created_at/title/text',
    'created_at asc/title/text',
    'created_at desc/title/text',
    'created_at/title asc/text',
    'created_at/title desc/text',
    'created_at/title/text asc',
    'created_at/title/text desc',
    'created_at asc/title asc/text',
    'created_at desc/title asc/text',
    'created_at asc/title desc/text',
    'created_at desc/title desc/text',
    'created_at asc/title/text asc',
    'created_at desc/title/text asc',
    'created_at asc/title/text desc',
    'created_at desc/title/text desc',
    'created_at asc/title asc/text asc',
    'created_at asc/title asc/text desc',
    'created_at desc/title desc/text desc',
  ])('Given valid string %p then should test true', (str) => {
    expect(entriesOrderByRegex.test(str)).toBe(true);
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
    expect(entriesOrderByRegex.test(str)).toBe(false);
  });
});
