const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];
const INITIAL_YEAR = 1990;
const FINAL_YEAR = 2030;
const FIRST_DAY = 0;
const DAYS = 7;
var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();
var currentWeek = today.getDate();

function getDaysInWeek (fromDate) {
    var sundayOfThisWeek = new Date(fromDate.setDate(fromDate.getDate() + (DAYS - fromDate.getDay()))),
        result = [new Date(sundayOfThisWeek)];
    while (sundayOfThisWeek.setDate(sundayOfThisWeek.getDate() - 1) && sundayOfThisWeek.getDay() !== 0) {
        result.push(new Date(sundayOfThisWeek));
    }
    return result.reverse();
}

function daysInMonths (month, year) {
    return new Date(year, month, FIRST_DAY).getDate();
}

function currentDate (date) {
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    currentWeek = date.getDate();
    return [currentYear,currentMonth, currentWeek];
}

function monthSelect () {
    var selectMonth = document.getElementById('select-month');
    if (selectMonth === null) {
        selectMonth = document.createElement('select');
    }
    for (var index in monthNames) {
      var option = document.createElement('option');
      option.setAttribute('value', index);
      option.innerHTML = monthNames[index];
      selectMonth.appendChild(option);
    }
    return 0;
}

function yearSelect () {
    var selectYear = document.getElementById('select-year');
    if (selectYear === null) {
        selectYear = document.createElement('select');
    }
    for (var year = INITIAL_YEAR; year <= FINAL_YEAR; year++) {
      var option = document.createElement('option');
      option.setAttribute('value', year);
      option.innerHTML = year;
      selectYear.appendChild(option);
    }
    return 0;
}

module.exports = {
    getDaysInWeek,
    daysInMonths,
    currentDate,
    monthSelect,
    yearSelect,
  };