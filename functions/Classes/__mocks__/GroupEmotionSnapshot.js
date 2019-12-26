const mockSave = jest.fn();

module.exports = jest.fn(() => ({
  save: mockSave,
}));
