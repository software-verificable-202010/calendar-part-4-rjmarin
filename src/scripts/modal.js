const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
var eventId;
const errorMessage = 'Error al crear un nuevo evento, los campos son invalidos';
const  path = require('path');
const  closeModal  = require(path.resolve('src/scripts/utils/modalutils')).closeModal;
const  emptyInputs  = require(path.resolve('src/scripts/utils/modalutils')).emptyInputs;
const  getInputValues  = require(path.resolve('src/scripts/utils/modalutils')).getInputValues;

$(document).ready(function () {
    getEvent();
    $('#ends-at').datetimepicker();
    $('#starts-at').datetimepicker();
    getUsers();
    saveEvent();
    closeModal();
    deleteEvent();
});

function getUsers() {
    var users = ipc.sendSync('get-users');
    for (userIndex = 0; userIndex  < users.length; userIndex++) {
        $('#users').append( users[userIndex].id + ": " + users[userIndex].username + ', '); 
    }
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
    ipc.on('guest', function (e, guests) {
        var stringGuests = "";
        if (guests.length > 0) {
            guests.map(function (guest) {
                stringGuests = stringGuests.concat(guest.userid, ",");
            });
            if (eventId > 0) {
                document.getElementById('guest').value = stringGuests;
            }
        }
    });
}

function saveEvent () {
    var addBtn = document.getElementById('save-event');
    addBtn.addEventListener('click', function () {
        values = getInputValues();
        if (values === false) {
            errorMsg(errorMessage);   
        } else {
            if ( eventId !== undefined) {
                ipc.send('update-event', eventId, values[0],  values[1], values[2], values[3], values[4]);
            } else {
                ipc.send('add-event', values[0], values[1], values[2], values[3], values[4]);
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
    if (error === null) {
        error = document.createElement('div');
    }
    error.innerText = message;
    error.style.color = 'red';
    return error;
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
    return 0;
}
