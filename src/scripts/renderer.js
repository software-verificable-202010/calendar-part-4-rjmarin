const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const INITIAL_YEAR = 1990;
const FINAL_YEAR = 2030;
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

monthSelect();
yearSelect();
fill_calendar_month(currentMonth, currentYear);


function daysInMonths (month, year) {
    return new Date(year, month, 0).getDate();
}

function onChangeMonth() {
    selectedMonth = document.getElementById("select-month");
    currentMonth = parseInt(selectedMonth.value);   
    fill_calendar_month(currentMonth, currentYear);
}
function onChangeYear() {
    selectedYear = document.getElementById("select-year");
    currentYear = parseInt(selectedYear.value);  
    fill_calendar_month(currentMonth, currentYear);
}

function monthSelect(){
    let selectMonth = document.getElementById("select-month");
    for (var index in monthNames){
        let option =  document.createElement("option");
        option.setAttribute("value", index); 
        option.innerHTML = monthNames[index];
        selectMonth.appendChild(option);
    }

}


function yearSelect(){
    let selectYear = document.getElementById("select-year");    
    for (let year = INITIAL_YEAR; year <= FINAL_YEAR; year++){
        let option =  document.createElement("option");
        option.setAttribute("value", year); 
        option.innerHTML = year;
        selectYear.appendChild(option);
    } 

}


function fill_calendar_month(month, year) {
    date = new Date(year, month);
    document.getElementById("current-month").innerText = monthNames[month] + " " + year;
    // first day of the week order by monday to sunday
    let firstDay = date.getDay() -1;
    if (firstDay=== -1){
        firstDay = 6;
    }
    let daysInMonth = daysInMonths(month +1, year);
    
    let bodyCalendar = document.getElementById("calendar__month"); 

    // clearing data
    bodyCalendar.innerHTML = "";
    let dayCounter = 1;
    let classDays = ["calendar__day", "day"];
    for (let i = 0; i < 6; i++) { //weeks
        if (dayCounter > daysInMonth) {
            break;  
        }
        let week = document.createElement("div");
        week.className = "calendar__week";
        for (let j = 0; j < 7; j++) { //days
            let day = document.createElement("div");
                day.classList.add(...classDays);
            if(j == 5 || j == 6 ){
                day.classList.add("weekend");
            }
            if (i === 0 && j < firstDay || dayCounter > daysInMonth) {
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

}