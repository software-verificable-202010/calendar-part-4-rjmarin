const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const ISOLenthMysql = 19;
const errorMessage = 'Error al crear un nuevo evento, los campos son invalidos';
mysql = require('mysql');
var eventId;

function closeModal () {
    var closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', function () {
        var deleteBtn = document.getElementById('delete-event');
        deleteBtn.disabled = true;   
        var window = remote.getCurrentWindow();
        emptyInputs();
        window.close();
    });  
    return 0;
}


function getInputValues () {
    var values = [];
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var userNames = document.getElementById('guest').value.split(',');
    var start = new Date(document.getElementById('starts-at').value);
    var end = new Date(document.getElementById('ends-at').value);
    console.log(start);
    var startUTC = new Date(start.setHours(start.getHours() - 4));//local hours
    var endUTC = new Date(end.setHours(end.getHours() - 4));//local hours
    if (title === '' || start > end ) {
            errorMsg(errorMessage);  
            return false; 
    } else {
        //change format mysql datetime
        startString = startUTC.toISOString().replace('T', ' ').substring(0, ISOLenthMysql);
        endString = endUTC.toISOString().replace('T', ' ').substring(0, ISOLenthMysql);
        values.push(title);
        values.push(description);
        values.push(startString);
        values.push(endString);
        values.push(userNames);
    }
    return values;
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
        return 0;
    });
    return 0;
}

function emptyInputs () {
    document.getElementById('guest').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('starts-at').value = '';
    document.getElementById('ends-at').value = '';   
    return 0;
}

module.exports = {
    closeModal,
    errorMsg,
    emptyInputs,
    getInputValues,
    deleteEvent,
    saveEvent
};