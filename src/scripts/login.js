const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const errorMessage = 'User name is empty!';
mysql = require('mysql');
login(); 

function login () {
    var loginBtn = document.getElementById('btn-login');
    if (loginBtn === null) {
        loginBtn = document.createElement("button");
        loginBtn.id = "btn-login";
    }
    loginBtn.addEventListener('click', function () {
        var userName = document.getElementById('user-name').value;
        if (userName === '') {
            errorMsg(errorMessage);  
            return 0; 
        } else {
            //change format mysql datetime
            ipc.send('login', userName);
            var window = remote.getCurrentWindow();
            window.close();
        }
        return 1;
    });
    return 0;   
}   

function errorMsg (message) {
    error = document.getElementById('error');
    error.innerText = message;
    error.style.color = 'red';
    return error;
}

module.exports = {
    login,
    errorMsg
};

