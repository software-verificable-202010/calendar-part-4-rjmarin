const electron = require('electron');
const path = require('path');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const ISOLenthMysql = 19;
const errorMessage = "Error al crear un nuevo evento, los campos son invalidos";
mysql = require('mysql');


$(document).ready(function(){
    $("#ends-at").datetimepicker();
    $('#starts-at').datetimepicker();
    saveEvent();
    closeModal();
});


function closeModal() {
    var closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', function () {
        var window = remote.getCurrentWindow();
        window.close();
    });
    
}

function saveEvent() {
    var addBtn = document.getElementById('save-event');
    addBtn.addEventListener('click', function () {
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var start = new Date(document.getElementById('starts-at').value);
        var end = new Date(document.getElementById('ends-at').value);
        
        var startUTC = new Date(start.setHours(start.getHours()-4));//local hours
        var endUTC = new Date(end.setHours(end.getHours()-4));//local hours
        if (title == "" || start > end ){
            errorMsg(errorMessage);   
        }
        else{
            startString = startUTC.toISOString().replace("T", " ").substring(0,ISOLenthMysql);//change format mysql datetime
            endString = endUTC.toISOString().replace("T", " ").substring(0,ISOLenthMysql);//change format mysql datetime
            ipc.send('add-event',title, description, startString, endString);
            var window = remote.getCurrentWindow();
            window.close();
        }
    });
    
}

function errorMsg(message){
    error = document.getElementById('error');
    error.innerText = message;
    error.style.color = 'red';
}