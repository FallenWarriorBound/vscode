const { sum } = require('../sum.js');

test('adds numbers', () => {
  expect(sum(1, 2)).toBe(3);
});
