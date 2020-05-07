const {
  remote,
  ipcRenderer,
} = require('electron');
const BrowserWindow = remote.BrowserWindow;
const path = require('path');
const ipc = ipcRenderer;
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SUT", "SUN"];
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const INITIAL_YEAR = 1990;
const FINAL_YEAR = 2030;
const FIRST_DAY = 0;
const SUNDAY_VALUE = -1;
const SUNDAY_POSITION = 6;
const WEEK_ROWS = 6;
const DAYS = 7;
const HOURS = 24;
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let currentWeek = today.getDate();
var calendarType = 0; //0 = month; 1= week
monthSelect();
yearSelect();
changeCalendar();
navegateCalendar();
createCalendarMonth(currentMonth, currentYear);
nextWeek();
previousWeek();

/**************UTILS FUNCTIONS*************/
function getDaysInWeek(fromDate) {
  var sundayOfThisWeek = new Date(fromDate.setDate(fromDate.getDate() + (DAYS - fromDate.getDay()))),
    result = [new Date(sundayOfThisWeek)];
  while (sundayOfThisWeek.setDate(sundayOfThisWeek.getDate() - 1) && sundayOfThisWeek.getDay() !== 0) {
    result.push(new Date(sundayOfThisWeek));
  }
  return result.reverse();
}

function daysInMonths(month, year) {
  return new Date(year, month, FIRST_DAY).getDate();
}


function currentDate(date) {
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  currentWeek = date.getDate();
}
/*********************END UTILS**************/

/*********************MODAL******************/
function createModal() {
  const windowModal = new BrowserWindow({
    width: 500,
    height: 400,
    modal: true,
    parent: remote.getCurrentWindow(),
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  return windowModal;
}

function openModal() {
  windowModal = createModal();
  windowModal.loadFile('src/views/modalEvent.html');
  windowModal.show();
  windowModal.on('closed', () => {
    if(calendarType){
      createCalendarWeek(currentMonth,currentYear,currentWeek);
    }else{
      createCalendarMonth(currentMonth,currentYear);
    }
  });
}
/*****************END-MODAL****************/


/*************HEADER FUNCTION**********/
function getHeaderCalendar(CalendarType, day) {
  week = getDaysInWeek(day);
  if (CalendarType) {
    headerDay = document.getElementById('calendar-header').childNodes;
    for (divHeaderIndex = 1; divHeaderIndex < headerDay.length; divHeaderIndex += 2) {
      weekIndex = divHeaderIndex / 2 - 0.5;
      headerDay[divHeaderIndex].innerText = dayNames[week[weekIndex].getDay()] + "\n" + week[weekIndex].getDate();
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

function changeCalendar() {
  changeToWeekCalendarBtn = document.getElementById('change-to-week');
  changeToWeekCalendarBtn.addEventListener('click', function () {
    calendarType = 1;
    createCalendarWeek(currentMonth, currentYear, new Date().getDate());
    navegateCalendar();
  });
  changeToMonthCalendarBtn = document.getElementById('change-to-month');
  changeToMonthCalendarBtn.addEventListener('click', function () {
    calendarType = 0;
    createCalendarMonth(currentMonth, currentYear);
    navegateCalendar();
  });

}

function navegateCalendar() {
  if (calendarType) {
    document.getElementById("navegation-week").style.display = "inline";
    document.getElementById('navegation').style.display = "none";

  } else {
    document.getElementById("navegation-week").style.display = "none";
    document.getElementById('navegation').style.display = "block";
  }


}
/*****MONTH SELECT**********/
function onChangeMonth() {
  selectedMonth = document.getElementById("select-month");
  currentMonth = parseInt(selectedMonth.value);
  createCalendarMonth(currentMonth, currentYear);
}

function monthSelect() {
  let selectMonth = document.getElementById("select-month");
  for (var index in monthNames) {
    let option = document.createElement("option");
    option.setAttribute("value", index);
    option.innerHTML = monthNames[index];
    selectMonth.appendChild(option);
  }

}

/*****YEAR SELECT**********/
function onChangeYear() {
  selectedYear = document.getElementById("select-year");
  currentYear = parseInt(selectedYear.value);
  createCalendarMonth(currentMonth, currentYear);
}

function yearSelect() {
  let selectYear = document.getElementById("select-year");
  for (let year = INITIAL_YEAR; year <= FINAL_YEAR; year++) {
    let option = document.createElement("option");
    option.setAttribute("value", year);
    option.innerHTML = year;
    selectYear.appendChild(option);
  }
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
function createCalendarMonth(month, year) {

  getHeaderCalendar(calendarType, new Date());
  date = new Date(year, month);
  document.getElementById("current-month").innerText = monthNames[month] + " " + year;
  // first day of the week order by monday to sunday
  let firstDay = date.getDay() - 1;
  if (firstDay === SUNDAY_VALUE) { //changing de postion of Sunday
    firstDay = SUNDAY_POSITION;
  }
  let daysInMonth = daysInMonths(month + 1, year);
  let bodyCalendar = document.getElementById("calendar__month");
  // clearing data
  bodyCalendar.innerHTML = "";
  let dayCounter = 1;
  let classDays = ["calendar__day", "day"];
  for (let weeks = 0; weeks < WEEK_ROWS; weeks++) {
    if (dayCounter > daysInMonth) {
      break;
    }
    let week = document.createElement("div");
    week.className = "calendar__week";
    for (let days = 0; days < DAYS; days++) {
      let day = document.createElement("div");
      day.classList.add(...classDays);
      day.id = new Date(currentYear, currentMonth, dayCounter);
      day.setAttribute("onclick", "openModal()");
      if (days == 5 || days == 6) {
        day.classList.add("weekend");
      }
      if (weeks === 0 && days < firstDay || dayCounter > daysInMonth) {
        let dayNumber = document.createTextNode("");
        day.appendChild(dayNumber);
        week.appendChild(day);
      } else {
        let dayNumber = document.createTextNode(dayCounter);
        day.appendChild(dayNumber);
        week.appendChild(day);
        dayCounter++;
      }
    }
    bodyCalendar.appendChild(week); // appending each row into calendar body.
  }
  fillEventMonth();
}


function createCalendarWeek(month, year, weekIndex) {
  date = new Date(year, month, weekIndex);
  week = getDaysInWeek(new Date(year, month, weekIndex));
  currentDate(date);
  getHeaderCalendar(calendarType, new Date(year, month, weekIndex));
  document.getElementById("current-month").innerText = monthNames[currentMonth] + " " + currentYear;
  let bodyCalendar = document.getElementById("calendar__month");
  bodyCalendar.innerHTML = ""; // clearing data
  var classDays = ["calendar__day", "day"];
  for (let hour = 0; hour < HOURS; hour++) {
    var hours = document.createElement("div");
    for (let days = 0; days < DAYS; days++) {
      hours.className = "calendar__hour";
      let day = document.createElement("div");
      day.classList.add(...classDays);
      day.id = new Date(currentYear, currentMonth, week[days].getDate(), hour);
      day.setAttribute("onclick", "openModal()");
      if (days == 0) {
        day.innerText = hour + " hrs";
      }
      if (days == 5 || days == 6) {
        day.classList.add("weekend");
      }
      hours.appendChild(day);
    }
    bodyCalendar.appendChild(hours); // appending each row into calendar body.
  }
  fillEventWeek();
}
/**************END CALENDAR**************/

/**************FILL EVENTT***************/

//fill all events in calendar type of week
function fillEventMonth() {
  var events = ipc.sendSync('get-event');
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
    eventElement.innerHTML = start.getHours() + ":" + start.getMinutes() + " " + event.title;
    eventElement.appendChild(eventTitle);
    divDay.appendChild(eventElement);
  }

}
//fill all events in calendar type of week
function fillEventWeek() {
  var events = ipc.sendSync('get-event');
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
      var textEvent = start.getHours() + ":" + start.getMinutes() + " - " + end.getHours() + ":" + end.getMinutes() + "  " + event.title;
      eventElement = document.createElement('div');
      eventElement.style.background = event.color;
      eventElement.classList = ['text-left'];
      eventTitle = document.createElement('span');
      eventElement.id = textEvent;
      eventElement.innerHTML = textEvent;
      eventElement.appendChild(eventTitle);
      divDay.appendChild(eventElement);
      


    }
  }

}

ipc.on('sync-event', (e, arg) => {
  console.log("entry", arg);
  fillEventMonth();
  fillEventWeek();
});