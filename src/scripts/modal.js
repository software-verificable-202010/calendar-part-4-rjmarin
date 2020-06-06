const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const ISOLenthMysql = 19;
const errorMessage = 'Error al crear un nuevo evento, los campos son invalidos';
mysql = require('mysql');
var eventId;

$(document).ready(function () {
    getEvent();
    $('#ends-at').datetimepicker();
    $('#starts-at').datetimepicker();
    getUsers();
    saveEvent();
    closeModal();
    deleteEvent();
});

function closeModal () {
    var closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', function () {
        var deleteBtn = document.getElementById('delete-event');
        deleteBtn.disabled = true;   
        var window = remote.getCurrentWindow();
        emptyInputs();
        window.close();
    });  
}

function getUsers() {
    var users = ipc.sendSync('get-users');
    for (userIndex = 0; userIndex  < users.length; userIndex++) {
        $('#users').append( users[userIndex].id + ": " + users[userIndex].username + ', '); 
    }
}
function saveEvent () {
    var addBtn = document.getElementById('save-event');
    addBtn.addEventListener('click', function () {
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var userNames = document.getElementById('guest').value.split(',');
        var start = new Date(document.getElementById('starts-at').value);
        var end = new Date(document.getElementById('ends-at').value);
        var startUTC = new Date(start.setHours(start.getHours() - 4));//local hours
        var endUTC = new Date(end.setHours(end.getHours() - 4));//local hours
        if (title === '' || start > end ) {
            errorMsg(errorMessage);   
        } else {
            //change format mysql datetime
            startString = startUTC.toISOString().replace('T', ' ').substring(0, ISOLenthMysql);
            endString = endUTC.toISOString().replace('T', ' ').substring(0, ISOLenthMysql);
            if ( eventId !== undefined) {
                ipc.send('update-event', eventId, title, description, startString, endString, userNames);
            } else {
                ipc.send('add-event', title, description, startString, endString, userNames);
            }
            var deleteBtn = document.getElementById('delete-event');
            deleteBtn.disabled = true;
            emptyInputs();  
            var window = remote.getCurrentWindow();
            window.close();
        }
    });  
}

function errorMsg (message) {
    error = document.getElementById('error');
    error.innerText = message;
    error.style.color = 'red';
}

function getEvent() {
    ipc.send('get-window-request');
    ipc.on('event', function (e, event) {
        console.log(event);
        if (event.length > 0) {}
            document.getElementById('title').value = event[0].title;
            document.getElementById('description').value = event[0].description;
            document.getElementById('starts-at').value = event[0].start;
            document.getElementById('ends-at').value = event[0].end;
            eventId = event[0].id;
            var deleteBtn = document.getElementById('delete-event');
            deleteBtn.disabled = false;   
    }); 
}

function deleteEvent () {
    var deleteBtn = document.getElementById('delete-event');
    deleteBtn.addEventListener('click', function () {
        ipc.send('delete-event', eventId);
        var deleteBtn = document.getElementById('delete-event');
        deleteBtn.disabled = true; 
        emptyInputs();
        var window = remote.getCurrentWindow();
        window.close();
    });
}

function emptyInputs () {
    console.log("`limpiando");
    
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('starts-at').value = '';
    document.getElementById('ends-at').value = '';
}