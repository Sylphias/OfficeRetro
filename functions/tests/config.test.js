const { removeIndent, isEmoji } = require('../Helpers/TextHelpers');

test('removeIndent text helper', () => {
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

test('isEmoji text helper', () => {
  const emoji = '😭';
  const notEmoji = '!';
  expect(isEmoji(emoji)).toBe(true);
  expect(isEmoji(notEmoji)).toBe(false);
});
