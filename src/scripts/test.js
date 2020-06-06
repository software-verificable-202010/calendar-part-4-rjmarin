const assert = require('assert');
FIRST_DAY = 0;
date = new Date();
function daysInMonths (month, year) {
    return new Date(year, month, FIRST_DAY).getDate();
  }

it('should return true in June',function () {
  assert.equal(daysInMonths(date.getMonth(),date.getFullYear()), 30);
});
