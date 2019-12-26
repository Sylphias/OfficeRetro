const mockGet = jest.fn();
const mockCreate = jest.fn();
const mockDelete = jest.fn();
const mockGetCurrentDayTeamEmotion = jest.fn(() => [
  { userId: '111111', emotion: '😢' },
  { userId: '222222', emotion: '😊' },
  { userId: '333333', emotion: '🤬' },
  { userId: '444444', emotion: '😴' },
]);

module.exports = jest.fn(() => ({
  get: mockGet,
  create: mockCreate,
  delete: mockDelete,
  getCurrentDayTeamEmotion: mockGetCurrentDayTeamEmotion,
}));
