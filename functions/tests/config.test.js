const { removeIndent } = require('../Helpers/TextHelpers');

test('removeIndent', () => {
  const randoString = '123';
  expect(removeIndent`abc`).toBe('abc');
  expect(removeIndent`
    abc
  `).toBe('abc');
  expect(
    removeIndent`start of lines
    abc
    ${randoString}
  `,
  ).toBe('start of lines\nabc\n123');
});
