const dbProvider = require('../src/scripts/dbProvider.js');
connection = dbProvider.connection;
it('should get days in week', () => {
  expect(connection).toBeDefined();
});

it('should get  current week', () => {
  expect(dbProvider.setEvent(2, "title", "description", "start", "end", "color", [], connection)).toBe(0);
});

it('should get  current week', () => {
    expect(dbProvider.updateEvent(1, "title", "description", "start", "end", [3,4,5], connection)).toBe(0);
    expect(dbProvider.updateEvent(1, "title", "description", "start", "end", [], connection)).toBe(0);
});


