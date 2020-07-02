const {
  remote,
  ipcRenderer
} = require('electron');
const  path = require('path');
const BrowserWindow = remote.BrowserWindow;
const ipc = ipcRenderer;
const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SUT', 'SUN'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const SUNDAY_VALUE = -1;
const SUNDAY_POSITION = 6;
const WEEK_ROWS = 6;
const DAYS = 7;
const HOURS = 24;
const saturday = 5;
const sunday = 6;
var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();
var currentWeek = today.getDate();
var calendarType = 0;
var weekCalendarType = 1;
var monthCalendarType = 0;
var user;
const  daysInMonths  = require(path.resolve('src/scripts/utils/rendererUtils')).daysInMonths;
const  getDaysInWeek  = require(path.resolve('src/scripts/utils/rendererUtils')).getDaysInWeek;
const  monthSelect  = require(path.resolve('src/scripts/utils/rendererUtils')).monthSelect;
const  yearSelect  = require(path.resolve('src/scripts/utils/rendererUtils')).yearSelect;
getUser();
monthSelect();
yearSelect();
changeCalendar();
navegateCalendar();
createCalendarMonth(currentMonth, currentYear);
nextWeek();
previousWeek();

/**************UTILS FUNCTIONS*************/
function   getUser () {
  user = ipc.sendSync('user-logged');  
  console.log(user);
}

function currentDate (date) {
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  currentWeek = date.getDate();
}
/*********************END UTILS**************/

/*********************MODAL******************/
function createModal () {
  const windowModal = new BrowserWindow({
    width: 500,
    height: 500,
    modal: true,
    parent: remote.getCurrentWindow(),
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  return windowModal;
}

function openModal (eventId) {
  console.log(eventId);
  ipc.send('event-request', eventId);
  windowModal = createModal();
  windowModal.loadFile('src/views/modalEvent.html');
  windowModal.show();
  windowModal.on('closed', function () {
    if (calendarType === weekCalendarType) {
      createCalendarWeek(currentMonth, currentYear, currentWeek);
    } else {
      createCalendarMonth(currentMonth, currentYear);
    }
  });
}
/*****************END-MODAL****************/

/*************HEADER FUNCTION**********/
function getHeaderCalendar (CalendarType, day) {
  week = getDaysInWeek(day);
  if (CalendarType) {
    headerDay = document.getElementById('calendar-header').childNodes;
    for (divHeaderIndex = 1; divHeaderIndex < headerDay.length; divHeaderIndex += 2) {
      weekIndex = divHeaderIndex / 2 - 0.5;
      headerDay[divHeaderIndex].innerText = dayNames[week[weekIndex].getDay()] + '\n' + week[weekIndex].getDate();
    }
  } else {
    headerDay = document.getElementById('calendar-header').childNodes;
    for (divHeaderIndex = 1; divHeaderIndex < headerDay.length; divHeaderIndex += 2) {
      dayIndex = divHeaderIndex / 2 - 0.5;
      headerDay[divHeaderIndex].innerText = dayNames[week[dayIndex].getDay()];
    }
  }
}

/*****************SELECTS AND BUTTON FUNCTION***********/
function changeCalendar () {
  changeToWeekCalendarBtn = document.getElementById('change-to-week');
  changeToWeekCalendarBtn.addEventListener('click', function () {
    calendarType = weekCalendarType;
    createCalendarWeek(currentMonth, currentYear, new Date().getDate());
    navegateCalendar();
  });
  changeToMonthCalendarBtn = document.getElementById('change-to-month');
  changeToMonthCalendarBtn.addEventListener('click', function () {
    calendarType = monthCalendarType;
    createCalendarMonth(currentMonth, currentYear);
    navegateCalendar();
  });
}

function navegateCalendar () {
  if (calendarType) {
    document.getElementById('navegation-week').style.display = 'inline';
    document.getElementById('navegation').style.display = 'none';
  } else {
    document.getElementById('navegation-week').style.display = 'none';
    document.getElementById('navegation').style.display = 'block';
  }
}

/*****SELECT ON CHANGE**********/
function onChangeMonth () {
  selectedMonth = document.getElementById('select-month');
  currentMonth = parseInt(selectedMonth.value);
  createCalendarMonth(currentMonth, currentYear);
}

function onChangeYear () {
  selectedYear = document.getElementById('select-year');
  currentYear = parseInt(selectedYear.value);
  createCalendarMonth(currentMonth, currentYear);
}

function nextWeek() {
  nextWeekBtn = document.getElementById('next-week');
  nextWeekBtn.addEventListener('click', function () {
    currentWeek += 7;
    createCalendarWeek(currentMonth, currentYear, currentWeek);
  });
}

function previousWeek() {
  previousWeekBtn = document.getElementById('prev-week');
  previousWeekBtn.addEventListener('click', function () {
    currentWeek -= 7;
    createCalendarWeek(currentMonth, currentYear, currentWeek);
  });
}
/**************END CLICKED FUCTIONS***************/

/**************CREATE CALENDAR**********************/
function createCalendarMonth (month, year) {
  getHeaderCalendar(calendarType, new Date());
  date = new Date(year, month);
  document.getElementById('current-month').innerText = monthNames[month] + ' ' + year;
  // first day of the week order by monday to sunday
  var firstDay = date.getDay() - 1;
  if (firstDay === SUNDAY_VALUE) { //changing de postion of Sunday
    firstDay = SUNDAY_POSITION;
  }
  var daysInMonth = daysInMonths(month + 1, year);
  var bodyCalendar = document.getElementById('calendar__month');
  bodyCalendar.innerHTML = '';
  var dayCounter = 1;
  var classDays = ['calendar__day', 'day'];
  for (var weeks = 0; weeks < WEEK_ROWS; weeks++) {
    if (dayCounter > daysInMonth) {
      break;
    }
    var week = document.createElement('div');
    week.className = 'calendar__week';
    for (var days = 0; days < DAYS; days++) {
      var day = document.createElement('div');
      day.classList.add(...classDays);
      day.id = new Date(currentYear, currentMonth, dayCounter);
      if (days === saturday || days === sunday) {
        day.classList.add('weekend');
      }
      var dayNumber;
      if (weeks === 0 && days < firstDay || dayCounter > daysInMonth) {
        dayNumber = document.createTextNode('');
        day.appendChild(dayNumber);
        week.appendChild(day);
      } else {
        dayNumber = document.createTextNode(dayCounter);
        day.appendChild(dayNumber);
        week.appendChild(day);
        dayCounter++;
      }
    }
    bodyCalendar.appendChild(week); 
  }
  fillEventMonth();
}


function createCalendarWeek(month, year, weekIndex) {
  date = new Date(year, month, weekIndex);
  week = getDaysInWeek(new Date(year, month, weekIndex));
  currentDate(date);
  getHeaderCalendar(calendarType, new Date(year, month, weekIndex));
  document.getElementById('current-month').innerText = monthNames[currentMonth] + ' ' + currentYear;
  var bodyCalendar = document.getElementById('calendar__month');
  bodyCalendar.innerHTML = ''; 
  var classDays = ['calendar__day', 'day'];
  for (var hour = 0; hour < HOURS; hour++) {
    var hours = document.createElement('div');
    for (var days = 0; days < DAYS; days++) {
      hours.className = 'calendar__hour';
      var day = document.createElement('div');
      day.classList.add(...classDays);
      day.id = new Date(currentYear, currentMonth, week[days].getDate(), hour);
      if (days === 0) {
        day.innerText = hour + ' hrs';
      }
      if (days === saturday || days === sunday) {
        day.classList.add('weekend');
      }
      hours.appendChild(day);
    }
    bodyCalendar.appendChild(hours); 
  }
  fillEventWeek();
}
/**************END CALENDAR**************/

/**************FILL EVENTT***************/
function fillEventMonth () {
  var events = ipc.sendSync('get-events');
  for (eventIndex = 0; eventIndex < events.length; eventIndex++) {
    var event = events[eventIndex];
    var start = new Date(event.start);
    startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate()).toString();
    divDay = document.getElementById(startDate);
    if (!divDay) {
      continue;
    }
    eventElement = document.createElement('div');
    eventElement.style.background = event.color;
    eventElement.classList = ['text-left'];
    eventTitle = document.createElement('span');
    eventElement.innerHTML = start.getHours() + ':' + start.getMinutes() + ' ' + event.title;
    eventElement.appendChild(eventTitle);
    eventElement.id = events[eventIndex].id;
    if (events[eventIndex].userid === user.id) {
      console.log(events[eventIndex].userid, user.id);
      eventElement.setAttribute('onclick', 'openModal(' + events[eventIndex].id + ')');
    }
    divDay.appendChild(eventElement);
  }
}

function fillEventWeek() {
  var events = ipc.sendSync('get-events');
  for (eventIndex = 0; eventIndex < events.length; eventIndex++) {
    var event = events[eventIndex];
    var start = new Date(event.start);
    var end = new Date(event.end);
    hoursRegion = end.getHours() - start.getHours() + 1;
    for (hours = 0; hours < hoursRegion; hours++) {
      divDay = document.getElementById(new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours() + hours));
      if (!divDay) {
        continue;
      }
      var textEvent = start.getHours() + ':' + start.getMinutes() + ' - ' + end.getHours() + ':' + end.getMinutes() + '  ' + event.title;
      eventElement = document.createElement('div');
      eventElement.style.background = event.color;
      eventElement.classList = ['text-left'];
      eventTitle = document.createElement('span');
      eventElement.id = events[eventIndex].id;
      eventElement.innerHTML = textEvent;
      eventElement.appendChild(eventTitle);
      if (events[eventIndex].userid === user.id) {
        console.log(events[eventIndex].userid, user.id);
        
        eventElement.setAttribute('onclick', 'openModal(' + events[eventIndex].id + ')');
      }
      divDay.appendChild(eventElement);
    }
  }
}

