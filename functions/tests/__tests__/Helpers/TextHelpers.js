const TextHelper = require('../../../Helpers/TextHelpers');

describe('Text helpers should manipulate text', () => {
  test('removeIndent should remove leading spaces caused by newlines', () => {
    expect(TextHelper.removeIndent`
    This String has leading spaces
    `).toBe('This String has leading spaces');
    expect(TextHelper.removeIndent`       This String has leading spaces`).toBe('This String has leading spaces');
    expect(TextHelper.removeIndent`This String does not have leading spaces`).toBe('This String does not have leading spaces');
  });

  test('isEmoji should check if string only contains 1 emoji', () => {
    expect(TextHelper.isEmoji('😠')).toBeTruthy();
    expect(TextHelper.isEmoji('😠😠')).toBeFalsy();
    expect(TextHelper.isEmoji('😠Hello')).toBeFalsy();
  });
});
