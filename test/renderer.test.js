const renderer = require('../src/scripts/utils/rendererUtils');
const $ = require('jquery');
const document = require('../src/helpers/helper');
var day = new Date(2020,3,20);
document.body.innerHTML =
    '<div>' +
    '  <input type="text" class="form-control" id="user-name">' +
    '  <button class="btn btn-default next" id="btn-login">Login</button>' +
    '<div id="error"></div>' +
    '</div>';

it('should get days in week', () => {
  daysInWeek = renderer.getDaysInWeek(day);
  len = daysInWeek.length;
  expect(len).toBe(7);
});

it('should get days in month', () => {
  expect(renderer.daysInMonths(6,2020)).toBe(30);
});

it('should get  current week separate year, month, day', () => {
  expect(renderer.currentDate(day)).toStrictEqual([2020,3,26]);
});

it('should create month select', () => {
  expect(renderer.monthSelect()).toBe(0);
});
it('should create year select', () => {
  expect(renderer.yearSelect()).toBe(0);
});


